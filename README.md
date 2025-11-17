# 🎨 AI Photo Studio


<p align="center">
  A powerful web-based tool for editing and enhancing product photos using the power of the Google Gemini API. This project allows users to generate professional and stunning photographs by uploading an image, adjusting various photography parameters, and even providing a style reference image.
</p>

<p align="center">
  <a href="https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%2216CwadkY7sgVDB7bFkpAmHL-4odsW4Kkf%22%5D,%22action%22:%22open%22,%22userId%22:%22115549832520327383207%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing"><strong>🚀 Try the Live Demo!</strong></a>
</p>

---

## ✨ Key Features

- **🤖 Smart Prompt Generation:** Automatically analyzes the product image to create a detailed and professional prompt.
- **🎨 Style Transfer:** Upload a reference image to transfer its artistic style, color palette, and lighting to the new photo.
- **🔧 Full Scene Control:** Fine-tune settings for Aspect Ratio, Lighting Style, and Camera Perspective.
- **✍️ Editable Prompt:** Full control to edit and customize the AI-generated prompt.
- **🖼️ History Gallery:** Saves all generated images, allowing you to view and reuse them as a base image or a new style reference.
- **🚀 Powered by Gemini:** Utilizes the advanced `gemini-2.5-flash` model for analysis and `gemini-2.5-flash-image` for image generation.
- **🌗 Light & Dark Mode:** A beautiful and responsive UI that adapts to your preferred theme.
- **📱 Responsive Design:** A seamless user experience across both desktop and mobile devices.

## 🛠️ Tech Stack

- **React:** For building a dynamic, component-based user interface.
- **TypeScript:** To add type safety and improve the development experience.
- **Google Gemini API (@google/genai):** For all AI capabilities, from analysis to image generation.
- **Tailwind CSS:** For rapid and responsive UI design.

## 📸 Application Screenshots

<div align="center">
  <p><em>(A screenshot of the application's user interface in dark mode)</em></p>
  <img src="https://storage.googleapis.com/aistudio-public/gallery/16CwadkY7sgVDB7bFkpAmHL-4odsW4Kkf/screenshot.png" alt="Screenshot of the application" width="800"/>
</div>


## ⚙️ Setup and Installation Guide

To run this project locally, follow the steps below.

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes `npm`).
- A code editor like [VS Code](https://code.visualstudio.com/) with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.

### Installation Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/ai-photo-studio.git
    cd ai-photo-studio
    ```

2.  **Set Up Your API Key:**
    - To use the Gemini API, you need an API key. You can get one for free from **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
    - In the root of the project, create a new file named `secrets.js`.
    - Add the following content to `secrets.js`, replacing `YOUR_API_KEY` with your actual key:
      ```javascript
      // secrets.js
      process = {
        env: {
          API_KEY: 'YOUR_API_KEY'
        }
      }
      ```
    - **Important:** This file is already included in `.gitignore` to prevent you from accidentally publishing your API key.

3.  **Add the Script to HTML:**
    - Open the `index.html` file.
    - Before the line that imports `index.tsx`, add the following line to make your key accessible in the browser environment:
      ```html
      <script src="/secrets.js"></script>
      <!-- This should be right before the index.tsx script tag -->
      <script type="module" src="/index.tsx"></script>
      ```

4.  **Run the Project:**
    - This project is designed to run directly in the browser without a modern build tool.
    - In VS Code, right-click on the `index.html` file and select `Open with Live Server`.
    - The project will open in your default browser.

## 🔩 How It Works

The application's workflow can be summarized as follows:

1.  **Upload Product Image:** The user uploads the main source image.
2.  **Product Analysis:** The `gemini-2.5-flash` model analyzes the image and generates a detailed text description (the base prompt).
3.  **Style Analysis (Optional):** If a style image is uploaded, it is also analyzed by the model to extract its visual features (like color, light, and texture).
4.  **Final Prompt Construction:** User settings (lighting, camera angle, aspect ratio, etc.) are combined with the text descriptions to create a final, comprehensive, and powerful prompt.
5.  **Image Generation:** This prompt, along with the source product image (resized and optimized for the model), is sent to the `gemini-2.5-flash-image` model.
6.  **Display Result:** The final image is received, displayed on the "AI Canvas," and a copy is added to the history gallery.

## 🤝 Contributing

Contributions are welcome! If you have an idea for an improvement or have found an issue, please open a new **Issue** or submit a **Pull Request**.

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.
