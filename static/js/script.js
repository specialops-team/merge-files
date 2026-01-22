const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const fileListContainer = document.getElementById("fileListContainer");
const submitBtn = document.getElementById("submitBtn");

// Manage the cumulative file list
let dataTransfer = new DataTransfer();

fileInput.addEventListener("change", (e) => {
  // Add newly selected files to our cumulative list
  Array.from(e.target.files).forEach((file) => {
    dataTransfer.items.add(file);
  });

  syncAndRender();
});

function syncAndRender() {
  // Update the actual input element with the combined list
  fileInput.files = dataTransfer.files;

  fileList.innerHTML = "";
  const files = dataTransfer.files;

  if (files.length > 0) {
    fileListContainer.classList.remove("hidden");
    fileListContainer.classList.add("flex");
    submitBtn.disabled = false;
  } else {
    fileListContainer.classList.add("hidden");
    fileListContainer.classList.remove("flex");
    submitBtn.disabled = true;
  }

  Array.from(files).forEach((file, index) => {
    const li = document.createElement("li");
    li.className =
      "flex items-center justify-between p-4 text-sm text-gray-700 hover:bg-white transition-colors";
    li.innerHTML = `
            <div class="flex items-center truncate mr-4">
                <span class="bg-blue-100 text-blue-600 rounded px-2 py-1 text-xs font-bold mr-3">${index + 1}</span>
                <span class="truncate font-medium">${file.name}</span>
            </div>
            <button type="button" onclick="removeFile(${index})" class="text-gray-400 hover:text-red-500 flex-shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        `;
    fileList.appendChild(li);
  });
}

function removeFile(index) {
  const newDt = new DataTransfer();
  Array.from(dataTransfer.files).forEach((file, i) => {
    if (i !== index) newDt.items.add(file);
  });
  dataTransfer = newDt;
  syncAndRender();
}

function clearAllFiles() {
  dataTransfer = new DataTransfer();
  syncAndRender();
}
