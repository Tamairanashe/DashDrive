import { supabase } from "../lib/supabase";

export const auditLogService = {
    /**
     * Log an action performed on an entity (order, issue, store)
     */
    async logAction(
        entityType: 'order' | 'issue' | 'store',
        entityId: string,
        action: string,
        performedBy: string
    ) {
        try {
            const { error } = await supabase
                .from("audit_logs")
                .insert({
                    entity_type: entityType,
                    entity_id: entityId,
                    action,
                    performed_by: performedBy,
                });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error("Error writing audit log:", error);
            return { success: false, error };
        }
    },

    /**
     * Fetch audit logs for a specific entity
     */
    async getLogs(entityId: string) {
        const { data, error } = await supabase
            .from("audit_logs")
            .select("*")
            .eq("entity_id", entityId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }
};
