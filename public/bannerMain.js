  const fileInput = document.getElementById('file-upload');
  const fileText = document.querySelector('.upload-btn .upload-text');

  fileInput.addEventListener('change', function() {
    // Check if the user actually selected a file
    if (this.files && this.files.length > 0) {
      // Get the name of the first uploaded file
      const fileName = this.files[0].name
      // Change the placeholder text to the file name
      fileText.textContent = fileName;
    } else {
      // Reset to default if they cancel the upload
      fileText.textContent = "Upload Image";
    }
  });
