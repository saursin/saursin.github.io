---
layout: page
title: Game of Life
description: a terminal-based version of the popular Conway's game of life
img: assets/img/projects/game-of-life/game_of_life_screenshot.png
importance: 1
category: fun
related_publications: false
---

Conway’s Game of Life is a classic in computer science — a zero-player game where simple rules give rise to endlessly surprising patterns.


<a class="btn btn-primary" href="https://github.com/saursin/game-of-life" role="button" target="_blank">
  Github Repository
</a>


<div class="row">
  <div class="col-sm mt-3 mt-md-0 text-center">
    {% include figure.liquid
       path="assets/img/projects/game-of-life/game_of_life_screenshot.png"
       title="Game of Life"
       caption="Game of Life"
       class="img-fluid rounded z-depth-1 mx-auto d-block w-50"
       align="center" %}
  </div>
</div>

## Features:
- Play/Pause anytime with a single key.
- Four speed levels – slow motion for careful observation or fast-forward for chaos.
- Save your creations to a text file with the s key.
- Load patterns (like gliders or guns) by passing a file name at launch.
- Live editing mode – pause the game, move a cursor around, and toggle cells interactively.

## Rules of Conway’s Game of Life
Each cell on the grid can be alive or dead. Time advances in discrete steps (generations). At each step, every cell updates based on its 8 neighbors:
- Any live cell with fewer than 2 live neighbors dies → underpopulation.
- Any live cell with 2 or 3 live neighbors lives on → survival.
- Any live cell with more than 3 live neighbors dies → overpopulation.
- Any dead cell with exactly 3 live neighbors becomes alive → reproduction.

> If you’re curious about complexity arising from simple rules — or you just want to waste a few mesmerizing minutes watching pixels dance — give it a try!
