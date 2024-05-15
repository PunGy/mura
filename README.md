# 2D Game Engine

Here lies a game engine I build in a spare time for fun. It uses plain browser canvas2d for graphics without any dependencies (maybe yet).

You can checkout current state here(space invaders): https://mura.pungy.me/

## Structure

* **src/main.ts** - The game entry point and engine initialization (must be abstracted up)
* **src/nodes** - Basic nodes collection (inspired by Godot)
* **src/scenes** - Tools for management scenes
* **src/services** - Basic API for interacting with the Engine. In general, singleton services for different kinds of game controlling activities
* **src/services/ServiceProvider.ts** - Service Locator pattern for accessing services. The only way to access other services
* **src/games/** - Developed games on top of the engine

## Roadmap
[-] Sound system
[] Multiplayer
[] AI
[] Physics
