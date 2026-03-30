-- 1. Create function to automatically cleanup stale 'ready' orders
-- This ensures that orders forgotten on the shelf don't pollute real-time analytics
CREATE OR REPLACE FUNCTION public.cleanup_stale_ready_orders()
RETURNS void AS $$
BEGIN
  -- Mark orders as 'unfulfilled' with a reason if they've been 'ready' for more than 12 hours
  -- and haven't been completed yet.
  UPDATE public.orders
  SET status = 'unfulfilled',
      completed_at = NOW()
  WHERE status = 'ready'
    AND ready_at < NOW() - INTERVAL '12 hours';

  -- Optional: Create an entry in unfulfilled_orders for loss tracking
  INSERT INTO public.unfulfilled_orders (order_id, reason, revenue_loss)
  SELECT id, 'STALE_READY_ORDER_TIMEOUT', total_amount
  FROM public.orders
  WHERE status = 'ready'
    AND ready_at < NOW() - INTERVAL '12 hours'
    AND id NOT IN (SELECT order_id FROM public.unfulfilled_orders);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Note on Automation: 
-- In a production Supabase environment, you would schedule this using pg_cron:
-- SELECT cron.schedule('0 0 * * *', 'SELECT public.cleanup_stale_ready_orders()');
