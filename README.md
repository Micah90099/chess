# Chess Board Project

## Overview / Description
This is a browser-based chess game built completely in javascript. It lets two players play on a board that handles movement, captures, castling, en passant, and draw conditions automatically. The goal of the project was to make a full chess engine that works visually, not just code that checks moves. I wanted something simple, fast, and satisfying to interact with.

The main idea was to recreate the real chess feel using drag-and-drop pieces and full move validation. I built it to see how vanilla javascript alone could go in simulating game logic without using any big frameworks or libraries.

## Opening Project
Since this is a simple HTML/CSS/Javascript project with no libraries or outside modules, all you must do is open the HTML file locally.

## Build Process and Documentation
I started by mapping the chessboard to a one-dimensional array (0–63) to make move math easier. From there, I added all the rules like pawn promotion, castling, and en passant, all handled in javascript with functions that simulate legal moves. I also built an invisible grid that checks for things like check, checkmate, and stalemate without messing up the visible board.

The hardest part was legal move validation and check/checkmate detection. I solved this by creating temporary board states and running simulations to test if the move left the king in check.

**in progress:** adding timers, move undo, and a better UI for showing check/checkmate.

## Technical Details / Features
- **Built with:** Javascript, HTML, CSS
- **Key features:**
  - Full legal move generation
  - Supports en passant, castling, pawn promotion
  - Detects check, checkmate, stalemate, threefold repetition, and 50-move rule
  - Visual board updates with draggable pieces
  - Simple move notation display

## Skills Demonstrated
- Javascript programming and debugging  
- Logic design for game rules and conditions  
- UI event handling and drag-drop implementation  
- Creative problem-solving for simulating board states  
- Working with DOM manipulation and element scoping

## Reflection / Learning
I learned a lot about game logic, especially how to structure condition-heavy code without it turning into a mess. I also got better at debugging weird edge cases (like two en passant moves colliding). Making the invisible “simulation grid” was a breakthrough moment for me, it let me check legality safely and cleanly.

This project reinforced how much I like working at the intersection of logic and design. It’s satisfying to see code directly affect movement and visuals in real time.

## Future Plans
- Add AI opponent using minimax algorithm  
- Create move history sidebar with timestamps  
- Polish the UI and make the board responsive  
- Maybe port the logic into a mobile app or small physical chessboard using a raspberry pi

---

*made as a fun logic + ui project to see how far javascript alone can go with chess.*