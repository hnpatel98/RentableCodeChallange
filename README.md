# Rentable Full Stack Code Challenge

## Table of Contents
* [Project Overview](#project-overview)
* [Getting Started](#getting-started)
* [The Challenge](#the-challenge)
  * [Challenge 1: Include Transaction Type in the Transaction Model](#challenge-1-include-transaction-type-in-the-transaction-model)
  * [Challenge 2: Render a Tenant Ledger](#challenge-2-render-a-tenant-ledger)
  * [Challenge 3: Calculate and Display Balance](#challenge-3-calculate-and-display-balance)
* [How to Submit](#how-to-submit)
* [Follow-up & FAQ](#follow-up--faq)
  * [Can I run this without Dev Containers?](#can-i-run-this-without-dev-containers)
* [Questions](#questions)

Welcome to the Rentable Full Stack Code Challenge! This challenge is designed to assess your abilities as a full-stack engineer, specifically focusing on your comfort with Python (Django), React, consuming APIs, and processing financial data within the context of property management systems.

To focus on evaluating ability to learn an existing codebase and build upon it, a base application structure is already in place. Your task is to navigate, understand, and extend this existing codebase to implement new features.

Expect to take about 2 hours with the assistance of AI tooling, such as Cursor or GitHub Copilot.

## Project Overview

This project simulates a property management system for managing tenant's and their transaction ledgers.

There is a **React front end** that displays a list of Tenants with a button for viewing transaction ledgers. 

There is a **Python and Django backend** with a command for importing transactions and APIs that return tenants and their transactions. The Djanog backend utilizes a SQLite database.

**Important Note:** The backend also includes an API for getting transaction data. While the raw transaction data is available in `backend/api/integration-data/transactions.json` within this repository, this file is intended to simulate data from an external integration API. Therefore, **you should only access transaction data through the `api/simulated-pms-integration-api/transactions/` endpoint** and not directly read the JSON file.

## Getting Started

This project is configured to run within a [Dev Container](https://code.visualstudio.com/docs/devcontainers/containers) (e.g., in VS Code or Cursor), which is the **recommended** setup method and streamlines dependency installation. If you prefer not to use Dev Containers, [manual setup instructions are available in the FAQ](#can-i-run-this-without-dev-containers).

1.  **Ensure Dev Containers Extension is Installed:** First, ensure you have the [Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) VSCode extension installed.

2.  **Open the Project in a Dev Container:** Open this project folder in Cursor or VS Code. You should be prompted to "Reopen in Container" or "Open in Dev Container". Click on this prompt to proceed.
    *   **Alternatively, from the Command Palette:** If you don't see a prompt, open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P) and search for "Dev Containers: Reopen in Container" (or "Dev Containers: Open Folder in Container...") and select it.

3.  **Run Services:** Once the dev container is ready and dependencies are automatically installed, you can start both the Django backend and React frontend services by running the provided `start.sh` script from the project root:
    ```bash
    ./start.sh
    ```

4. **Terminal Access:** Click `View -> Terminal` to open a Terminal within the Dev Container when executing the python commands and shell scripts. 

---

The backend will be running at [`http://127.0.0.1:8009/`](http://127.0.0.1:8009/) and the frontend at [`http://localhost:3009/`](http://localhost:3009/).

## The Challenge

The challenge is to enhance this application to visualize a tenant's financial ledger. This challenge involves working with the Django backend to properly store and expose transaction data, and then acesss and display that data in the front end. It is split into 3 Challenges:

### Challenge 1: Include Transaction Type in the Transaction Model

To display a tenant's ledger and calculate their balance, we need both the transaction amount and its type (charge or payment). 

Currently, our [Transaction](backend/api/models.py) model stores the amount, but not the type. Transactions are imported into our application's database using a Django management command, which pulls data from a simulated Property Management API at [`http://127.0.0.1:8009/api/simulated-pms-integration-api/transactions/`](http://127.0.0.1:8009/api/simulated-pms-integration-api/transactions/). 

The application API that the frontend calls for individual transaction data is [`http://127.0.0.1:8009/api/transactions/?tenant_id=1`](http://127.0.0.1:8009/api/transactions/?tenant_id=1), and at present, this endpoint does not return the transaction type. The goal of this challenge is to update the `/api/transactions/` API to include the transaction type, making it accessible for frontend display and calculations.

1.  **Update `backend/api/models.py`:** Modify the [Transaction](backend/api/models.py) model to include a new field that stores the transaction 'type'
    * **Generate & Apply Migrations:** After updating the model, you'll need to create a new database migration and apply it.
        *   Generate: `python backend/manage.py makemigrations api`
        *   Apply: `python backend/manage.py migrate`

2.  **Update & Run Import Command:**
    *   **Update `backend/api/management/commands/import_transactions.py`:** This command currently imports transactions from the integration API into the database. Your task is to modify this command to ensure it also imports and correctly populates the new 'type' field in your `Transaction` model.
    *   **Run the Import Command:** Execute the command to populate your database with the detailed transaction data:
        ```bash
        ./backend/manage.py import_transactions
        ```
It is recommended to verify the Transaction API, ([`http://127.0.0.1:8009/api/transactions/?tenant_id=1`](http://127.0.0.1:8009/api/transactions/?tenant_id=1)), now includes the 'type' fields for each transaction. 

### Challenge 2: Render a Tenant Ledger

In the `frontend`, implement the View Ledger button to display a list of transactions for a Tenant. 

Use the ([`http://127.0.0.1:8009/api/transactions/?tenant_id=1`](http://127.0.0.1:8009/api/transactions/?tenant_id=1)) API for retrieving transactions for each individual tenant.

How to display the Ledger, including stying, is up to you.


### Challenge 3: Calculate and Display Balance

In addition to the transaction list, calculate charges and payments to get the current balance and display it on the tenant's ledger. Ensure your calculation correctly uses the 'type' field to differentiate between charges and payments.

Where to show the balance, and how to style it, is up to you.


## How to Submit

This project is configured as a GitHub Template repository for you to clone, solve, and then push to your own GitHub account. To submit your solution, please follow these steps:

1.  **Create Your Own Repository:** On the Rentable Full Stack Code Challenge GitHub page, click the green "Use this template" button. This will allow you to create a new repository under your own GitHub account, pre-populated with this challenge's codebase.

2.  **Clone Your Repository:** Clone your newly created repository to your local machine using `git clone`.

3.  **Complete the Challenge:** Work on the challenge within your local clone.

4.  **Push Your Changes:** Commit your changes and push them to your repository on GitHub.

5.  **IMPORTANT - Share the Link:** Share the URL of your completed GitHub repository with your hiring contact.


## Follow-up & FAQ

*   **Will this be part of the Technical Interview?:** Your submitted code will be reviewed during a follow-up technical interview, where we will discuss your how you went about learning the codebase and implementation details. We will also perform a live code exercise building upon your solution.

*   **Can I use AI Tooling?** You are welcomed and encouraged to use AI development tools (e.g., GitHub Copilot, ChatGPT, Cursor AI) for learning about the code base and familiarizing yourself with the tech stack, if you are not already familiar. If you choose to generate code with AI tooling, be prepared to thoroughly discuss *why* you chose the path suggested by the AI tool. 

*   **Can I run this without Dev Containers?**

    If you prefer not to use Dev Containers, you will need to manually install dependencies for both the backend and frontend. You may need to adjust these instructions based on your specific development environment.

    **Backend Setup:**

    1.  Navigate to the `backend` directory: `cd backend`
    2.  Install Python dependencies: `pip install -r requirements.txt`
    3.  Run Django migrations: `python manage.py migrate`
    4.  Seed the database with initial data: `python manage.py seed_data`

    **Frontend Setup:**

    5.  In a separate terminal, navigate to the `frontend` directory: `cd frontend`
    6.  Install Node.js dependencies: `npm install`

    **Start the projects**

    7. Start both the Django backend and React frontend services by running the provided `start.sh` script from the project root:
        ```bash
        ./start.sh
        ```

    ---

    The backend will be running at [`http://127.0.0.1:8009/`](http://127.0.0.1:8009/) and the frontend at [`http://localhost:3009/`](http://localhost:3009/).

*   **Questions:** If you have any questions about the challenge, please feel free to email your hiring contact.

## Questions

If you have any questions about the challenge, please feel free to email your hiring contact.