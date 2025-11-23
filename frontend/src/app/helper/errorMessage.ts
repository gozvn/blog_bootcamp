export const ErrorMessages: Record<string, Record<string, string>> = {
    image: {
        required: 'This field is required.',
        invalidImageType: 'Only JPG, PNG, WEBP images are allowed.',
        fileTooLarge: 'Image size must be less than 2MB.',
        uploadFailed: 'Failed to upload image.',
    },
    title: {
        required: 'Title is required.',
        minLength: 'Title is too short.',
    }
};
