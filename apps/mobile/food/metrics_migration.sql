-- 1. Add ready_at column to orders for better SLA tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS ready_at TIMESTAMP;

-- 2. Create RPC function for real-time dashboard metrics
CREATE OR REPLACE FUNCTION public.get_store_metrics(p_store_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_orders_today INT;
  v_total_revenue NUMERIC;
  v_avg_prep_min INT;
  v_live_issues INT;
BEGIN
  -- Orders Today (New, In Progress, Ready, Completed today)
  SELECT COUNT(*) INTO v_orders_today
  FROM orders
  WHERE store_id = p_store_id
    AND created_at >= CURRENT_DATE;

  -- Net Revenue Today (Completed orders)
  SELECT COALESCE(SUM(total_amount), 0) INTO v_total_revenue
  FROM orders
  WHERE store_id = p_store_id
    AND status = 'completed'
    AND created_at >= CURRENT_DATE;

  -- Avg Prep Time (Minutes) - Real-time Kitchen Velocity (1-day rolling window)
  SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (ready_at - accepted_at))/60), 0)::INT INTO v_avg_prep_min
  FROM orders
  WHERE store_id = p_store_id
    AND ready_at IS NOT NULL
    AND accepted_at IS NOT NULL
    AND created_at >= NOW() - INTERVAL '1 day';

  -- Live Issues (Open or Reviewing)
  SELECT COUNT(*) INTO v_live_issues
  FROM issues
  WHERE status IN ('open', 'reviewing')
    AND order_id IN (SELECT id FROM orders WHERE store_id = p_store_id);

  RETURN JSONB_BUILD_OBJECT(
    'orders_today', v_orders_today,
    'total_revenue', v_total_revenue,
    'avg_prep_min', v_avg_prep_min,
    'live_issues', v_live_issues,
    'new_count', (SELECT COUNT(*) FROM orders WHERE store_id = p_store_id AND status = 'new' AND created_at >= CURRENT_DATE),
    'in_progress_count', (SELECT COUNT(*) FROM orders WHERE store_id = p_store_id AND status = 'in_progress' AND created_at >= CURRENT_DATE),
    'ready_count', (SELECT COUNT(*) FROM orders WHERE store_id = p_store_id AND status = 'ready' AND ready_at >= NOW() - INTERVAL '2 hours'),
    'avg_ready_wait_min', (SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (NOW() - ready_at))/60), 0)::INT FROM orders WHERE store_id = p_store_id AND status = 'ready' AND ready_at IS NOT NULL)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
