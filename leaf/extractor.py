import zipfile
import os

# Content for files
index_html = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Notes Panel</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      background: #f4f6f8;
      color: #333;
      overflow-x: hidden;
    }
    .container {
      max-width: 800px;
      margin: 40px auto;
      background: #fff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 1;
    }
    h2, h3 {
      margin-top: 0;
      color: #2c3e50;
    }
    pre {
      background: #ecf0f1;
      padding: 15px;
      border-radius: 6px;
      font-family: monospace;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    button {
      background: #3498db;
      color: #fff;
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.2s ease;
    }
    button:hover {
      background: #2980b9;
      transform: scale(1.05);
    }
    textarea {
      width: 100%;
      padding: 12px;
      margin-top: 8px;
      margin-bottom: 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 16px;
    }
    #adminPanel {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: all 0.4s ease;
    }
    #adminPanel.show {
      max-height: 1000px;
      opacity: 1;
      margin-top: 30px;
    }

    #loginModal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(8px);
      background: rgba(0, 0, 0, 0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    #loginModal.active {
      display: flex;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 10px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      text-align: center;
      animation: slideIn 0.4s ease;
      position: relative;
    }

    .modal-content input {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      margin-top: 15px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    .error-screen {
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    .error-screen.show {
      display: flex;
    }

    .red-x {
      font-size: 100px;
      color: red;
      animation: popIn 0.4s ease;
    }

    .error-text {
      font-size: 20px;
      margin-top: 20px;
      color: red;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes popIn {
      0% { transform: scale(0); opacity: 0; }
      80% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); }
    }

    @media (max-width: 600px) {
      .container {
        margin: 20px;
        padding: 20px;
      }
    }
  </style>
</head>
<body>

  <div class="container">
    <h2>📓 Shared Notes</h2>
    <pre id="notesDisplay">Loading notes...</pre>
    <hr>
    <button onclick="openLogin()">🔐 Admin Logon</button>

    <div id="adminPanel">
      <h3>✏️ Edit Notes</h3>
      <form id="editorForm">
        <textarea id="notesEditor" rows="10"></textarea><br>
        <button type="submit">💾 Save Notes</button>
      </form>
    </div>
  </div>

  <!-- Login Modal -->
  <div id="loginModal">
    <div class="modal-content" id="loginBox">
      <h3>Admin Login</h3>
      <input type="password" id="passwordInput" placeholder="Enter admin password">
      <button onclick="checkPassword()">Login</button>
    </div>
    <div class="error-screen" id="errorScreen">
      <div class="red-x">❌</div>
      <div class="error-text">Incorrect Password</div>
      <button onclick="goBack()">🔙 Go Back</button>
    </div>
  </div>

  <script>
    const PASSWORD = "79204";

    fetch('notes.txt')
      .then(response => response.text())
      .then(data => {
        document.getElementById("notesDisplay").textContent = data;
        document.getElementById("notesEditor").value = data;
      })
      .catch(() => {
        document.getElementById("notesDisplay").textContent = "⚠️ Failed to load notes.";
      });

    function openLogin() {
      document.getElementById("loginModal").classList.add("active");
      document.getElementById("loginBox").style.display = "block";
      document.getElementById("errorScreen").classList.remove("show");
    }

    function goBack() {
      document.getElementById("loginBox").style.display = "block";
      document.getElementById("errorScreen").classList.remove("show");
    }

    function checkPassword() {
      const input = document.getElementById("passwordInput").value;
      const adminPanel = document.getElementById("adminPanel");
      const modal = document.getElementById("loginModal");

      if (input === PASSWORD) {
        adminPanel.classList.add("show");
        modal.classList.remove("active");
        document.getElementById("passwordInput").value = "";
      } else {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("errorScreen").classList.add("show");
      }
    }

    document.getElementById("editorForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const updatedNotes = document.getElementById("notesEditor").value;

      fetch('save_notes.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-
