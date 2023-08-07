import { ref } from 'vue';

export function useFormValidator() {
    const errors = ref({});
  
    function validateForm(formData) {
      errors.value = {}; // Clear previous errors
  
      // Validate each field in the formData
      Object.keys(formData).forEach((fieldName) => {
        if (isEmpty(formData[fieldName])) {
          errors.value[fieldName] = `${fieldName} is required`;
        }
        // Add more validation logic here based on your requirements
      });
  
      // Return true if there are no errors, otherwise false
      return Object.keys(errors.value).length === 0;
    }
  
    return {
      errors,
      validateForm,
    };
}