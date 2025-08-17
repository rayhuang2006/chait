# chait

[English](README.md)

一個功能齊全的聊天應用程式，具有使用者驗證、角色選擇和管理面板。

## 功能

*   **使用者驗證：** 安全的使用者註冊和登入。
*   **即時聊天：** 與其他使用者即時傳訊。
*   **角色選擇器：** 選擇一個角色來代表您在聊天中。
*   **管理面板：** 管理使用者和應用程式的其他方面。

## 技術棧

*   **前端：** React, Vite
*   **後端：** Node.js, Express.js
*   **資料庫：** SQLite

## 入門

這些說明將幫助您在本地電腦上啟動並執行專案的副本，以進行開發和測試。

### 先決條件

*   [Node.js](https://nodejs.org/) (包含 npm)

### 安裝

1.  **複製儲存庫：**

    ```bash
    git clone https://github.com/rayhuang2006/chait.git
    cd chait
    ```

2.  **安裝伺服器依賴項：**

    ```bash
    cd server
    npm install
    ```

3.  **安裝客戶端依賴項：**

    ```bash
    cd ../client
    npm install
    ```

### 執行應用程式

1.  **啟動伺服器：**

    在 `server` 目錄中，執行：

    ```bash
    npm start
    ```

    伺服器將在 3000 連接埠上啟動。

2.  **植入資料庫：**

    在一個單獨的終端中，從 `server` 目錄中執行：

    ```bash
    npm run seed
    ```

    這將使用初始資料填充資料庫。

3.  **啟動客戶端：**

    在一個單獨的終端中，從 `client` 目錄中執行：

    ```bash
    npm run dev
    ```

    客戶端將在 5173 連接埠上啟動。

## 用法

1.  開啟瀏覽器並導航至 `http://localhost:5173`。
2.  註冊一個新帳戶或使用現有帳戶登入。
3.  選擇一個角色。
4.  開始與其他使用者聊天。

## 授權

本專案根據 MIT 授權條款授權 - 有關詳細資訊，請參閱 [LICENSE](LICENSE) 檔案。
