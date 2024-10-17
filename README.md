# **Engaging**  
_A real-time messaging platform built with React, Inertia.js, Laravel, Laravel Reverb, TailwindCSS, and MySQL._  

## **Features**  
- **User Authentication:**  
  - Sign up and sign in seamlessly using Laravel authentication.  
- **Conversation Management:**  
  - Personal and group chats.  
  - Real-time updates when new messages are received.  
- **Messaging:**  
  - Send and receive messages in real-time.  
  - Markdown support for rich-text formatting.  
  - Emojis and file attachments (image and document uploads).  
- **User Controls:**  
  - Block users to avoid unwanted messages.  
  - Delete your own messages from any conversation.  
- **Group Chats:**  
  - Create and manage group chats.  
  - Add or remove members dynamically.  
  - Update group info (name, photo, etc.).  
- **Notifications:**  
  - Real-time message notifications.  
  - Email notifications for specific events (e.g., group invites).  
- **User Profile Management:**  
  - Add or update profile photos.  
- **Infinite Scrolling:**  
  - Effortlessly browse through older messages as you scroll.  

---

## **Ingredients**  
- **Frontend:** React + Inertia.js + TailwindCSS  
- **Backend:** Laravel + Laravel Reverb  
- **Database:** MySQL (on Amazon Web Services)
- **Real-Time Communication:** Laravel Reverb (Websockets)  

---

## **Take a look**  
### The Landing Page 
![LandingPage](screenshots/Landing.png)

### Have a 1:1 conversation with Personal Chats
![PersonalChats](screenshots/PersonalChats.png)

### Have too many friends? Create a group! 
![CreateGroups](screenshots/CreateGroups.png)

### Never miss an update on the Tea☕ 
![GroupChats](screenshots/GroupChats.png)

### Hate suffering alone? Invite your friends to join you.. 
![InvitePeople](screenshots/InvitePeople.png)

### Be expressive with emojis, photos, and more! 
![Attachments](screenshots/Attachments.png)

### Be Unique Be You 
![Profile](screenshots/Profile.png)

---

## **Installation**  

***Prerequisite:** Please install [Docker](https://docs.docker.com/get-started/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) on your operating system*

Follow these steps to set up the project locally:

1. **Clone the repository (and navigate to it):**  
   ```bash
   git clone https://github.com/kumarsandeep567/engaging.git
   cd engaging
   ```

2. **Setup a MySQL database on AWS Relational Database Service**
- Provide the database host URL, database name, username, and password in the `.env.example` file
- Proceed to the next step once the database is ready

3. **Start the application with Docker Compose:**
    ```bash
   docker compose up
   ```

   *(If the above command does not work, try this)*

   ```bash
   docker-compose up
   ```

4. **View the application:**
- Visit `localhost` in the browser to view the application!
- To sign in to the application, use 
    - Email: `ryan@example.com` or `emma@example.com`
    - Password: `password`


## **Troubleshooting**  

- The `docker-compose.yml` file will try loading the database with some dummy data. Please be patient until the process is complete.
- If the script fails, you will have to manually load the database. To do this, 
    - Install PHP ([XAMPP](https://www.apachefriends.org/download.html) recommended for easy-to-use)
    - Start the Apache server
    - Navigate to the project directory in your terminal with ```cd engaging```
    - Run `php artisan migrate:fresh --seed --force`
    - In the `docker-compose.yml`, comment out the line `RUN php artisan migrate:fresh --seed --force`
    - Start the containers with Docker Compose