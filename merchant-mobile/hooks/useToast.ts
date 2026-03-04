import { useFeedback } from '../contexts/FeedbackContext';

export const useToast = () => {
    const { showToast } = useFeedback();
    return { showToast };
};
