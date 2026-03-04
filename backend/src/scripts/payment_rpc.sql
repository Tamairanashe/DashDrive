-- Atomic Wallet Transaction Function
-- Handles balance updates and transaction logging in one go.

CREATE OR REPLACE FUNCTION process_wallet_transaction(
    p_wallet_id UUID,
    p_type TEXT,
    p_amount DECIMAL,
    p_ref_type TEXT DEFAULT NULL,
    p_ref_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
) RETURNS VOID AS $$
DECLARE
    v_new_balance DECIMAL;
BEGIN
    -- 1. Update Wallet Balance
    UPDATE wallets 
    SET balance = balance + p_amount,
        updated_at = NOW()
    WHERE id = p_wallet_id
    RETURNING balance INTO v_new_balance;

    -- 2. Check for insufficient funds (if debit)
    IF p_amount < 0 AND v_new_balance < 0 THEN
        RAISE EXCEPTION 'Insufficient wallet balance';
    END IF;

    -- 3. Log Transaction
    INSERT INTO wallet_transactions (
        wallet_id,
        transaction_type,
        amount,
        net_amount,
        reference_type,
        reference_id,
        metadata
    ) VALUES (
        p_wallet_id,
        p_type,
        ABS(p_amount),
        p_amount,
        p_ref_type,
        p_ref_id,
        p_metadata
    );

END;
$$ LANGUAGE plpgsql;
