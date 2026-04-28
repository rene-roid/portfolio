var e=`# The brief

A rhythm runner game created using **Unity** and **C#** for a game jam held at my school in 2022. The game challenges the player to avoid obstacles by dodging left, right, or jumping — all in sync with the beat.

## How it works

Obstacles are generated procedurally at runtime, tied to the BPM of the current track. Every beat triggers a spawn event; difficulty scales with combo multiplier.

Audio synchronisation runs through **FMOD Studio**, which gave us sub-frame accuracy on beat events — critical for a game where timing is everything.

## Technical challenges

The project pushed me to learn real-time audio synchronisation, procedural obstacle generation, and rapid prototyping under a **48-hour deadline**.

Key problems solved:

- Beat-accurate obstacle spawn using FMOD's DSP clock
- Smooth camera follow with lerp-based easing
- Hitbox precision with CapsuleCast vs trigger colliders

## What I'd do differently

Given more time I'd add a custom chart editor so level designers can author obstacle patterns without touching code. The hard-coded BPM-to-spawn mapping worked for the jam but doesn't scale.


<!-- Image here -->
## Image
![Screenshot of the rhythm game showing the player character dodging an obstacle in sync with the beat. The UI displays the current combo multiplier and score.](/public/projects/dio_fight.gif)`;export{e as default};