# My Training Plan

This is a full-stack project utilizing a Monorepo structure. It is divided into two main parts: the **Frontend** (React + Vite) and the **Backend** (.NET Core API).

## 📁 Project Structure

```text
MyTrainingPlan/
├── Frontend/                 # React + TypeScript + Vite frontend application
├── Backend/                  # .NET Core API backend application
├── docs/                     # Project documentation (SRS, SDD)
├── .vscode/                  # VS Code workspace settings and launch configurations
├── README.md                 # This file
```

## 🚀 How to Run

### 1. Backend (.NET Core)
1. Navigate to the API directory:
   ```bash
   cd Backend/MyTrainingPlan.Api
   ```
2. Run the application:
   ```bash
   dotnet run
   ```
   *Alternatively, you can use the `.vscode/launch.json` configuration to run/debug the backend directly from Visual Studio Code.*

### 2. Frontend (React + Vite)
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies (only needed the first time or when packages change):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Documentation
- **SRS (System Requirements Specification):** details the functional and non-functional requirements of the system.
- **SDD (System Design Document):** details the architectural design and system components.
