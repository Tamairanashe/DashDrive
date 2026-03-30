import api from "../lib/api";
import { useStoreSettings } from "../store/useStoreSettings";
import { useSLASettings } from "../store/useSLASettings";

export const storeService = {
    /**
     * Fetch store configuration from Logistics Engine
     */
    async fetchStoreSettings(storeId: string) {
        try {
            const response = await api.get(`/stores/${storeId}`);
            const data = response.data;

            if (data) {
                useStoreSettings.getState().setAcceptanceMode(
                    data.acceptanceMode.toLowerCase() as 'manual' | 'auto'
                );
                useSLASettings.getState().setSLA(
                    data.slaWarningMinutes || 10,
                    data.slaBreachMinutes || 20
                );
            }
            return data;
        } catch (error) {
            console.error("Error fetching store settings:", error);
            return null;
        }
    },

    /**
     * Update store configuration
     */
    async updateStoreSettings(storeId: string, updates: any) {
        try {
            // Map settings to match backend schema if necessary
            const mappedUpdates: any = {};
            if (updates.acceptance_mode) mappedUpdates.acceptanceMode = updates.acceptance_mode.toUpperCase();
            if (updates.sla_warning_minutes) mappedUpdates.slaWarningMinutes = updates.sla_warning_minutes;
            if (updates.sla_breach_minutes) mappedUpdates.slaBreachMinutes = updates.sla_breach_minutes;
            if (updates.escalation_roles) mappedUpdates.escalationRoles = updates.escalation_roles;
            if (updates.escalation_enabled !== undefined) mappedUpdates.escalationEnabled = updates.escalation_enabled;

            await api.patch(`/stores/${storeId}`, mappedUpdates);

            // Update local state
            if (updates.acceptance_mode) {
                useStoreSettings.getState().setAcceptanceMode(updates.acceptance_mode);
            }
            if (updates.sla_warning_minutes !== undefined || updates.sla_breach_minutes !== undefined) {
                const current = useSLASettings.getState();
                useSLASettings.getState().setSLA(
                    updates.sla_warning_minutes ?? current.warningMinutes,
                    updates.sla_breach_minutes ?? current.breachMinutes
                );
            }

            return { success: true };
        } catch (error) {
            console.error("Error updating store settings:", error);
            return { success: false, error };
        }
    }
};
