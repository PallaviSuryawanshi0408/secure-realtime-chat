# Secure Real-Time Chat Application

## Overview
A full-stack secure real-time chat application built using React, Node.js, and Socket.IO.  
The system supports encrypted messaging with real-time communication features.

## Key Features
- Real-time messaging using Socket.IO
- Encrypted message transmission
- Typing indicators
- Read receipts
- Multi-user chat support
- Scalable client-server architecture

## Tech Stack
**Frontend**
- React
- CSS

**Backend**
- Node.js
- Express.js
- Socket.IO

## System Architecture
- Client establishes a WebSocket connection with the server
- Messages are encrypted before transmission
- Server handles real-time message broadcasting
- Clients decrypt messages upon receipt

## Why This Project?
This project demonstrates:
- Real-time communication handling
- Secure data transmission
- WebSocket-based system design
- Event-driven backend architecture

## Interview Highlight (1 line)
> Built a secure real-time chat system using WebSockets with encrypted messaging, typing indicators, and read receipts.

## How to Run Locally

```bash
# Backend
cd server
npm install
npm start
