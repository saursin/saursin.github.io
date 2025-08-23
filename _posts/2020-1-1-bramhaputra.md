---
layout: post
title: 'Forged in Sparks: The Story of Bramhaputra the BattleBot'
date: 2020-12-23
tags:
  - interview
  - hardware-security
images:
  compare: true
  slider: true
---

<div class="row justify-content-sm-center align-items-center">
  <!-- Text (left) -->
  <div class="col-sm-6 mt-3 mt-md-0">
    <p>
    In 2019, I teamed up with two fellow freshers to participate in the International Robowars Event at TechFest, IIT Bombay. Our bot, **Bramhaputra**, was probably the first major project of my life.
    </p>
    <p>
    Back then, we were just freshers in college. We didn’t even know the “R” of robotics. Honestly, we were hesitant about participating because we knew we’d face teams from across the continent, many of whom had years of experience. But instead of backing down, we looked at it as an opportunity: to learn robotics from scratch, to challenge ourselves, and to meet brilliant minds. Without overthinking, we assembled a team and started working on the proposal.
    </p>
  </div>

  <!-- Image (right) -->
  <div class="col-sm-6 mt-3 mt-md-0">
    <figure>
      {% include figure.liquid path="assets/img/posts/2020-1-1-bramhaputra/bramhaputra-logo.png" 
         title="The Son of Wayachi at the Battelbots-2019" 
         class="img-fluid rounded z-depth-1" %}
      <figcaption class="caption text-center mt-2">
        The Son of Whyachi at BattleBots 2019
      </figcaption>
    </figure>
  </div>
</div>


## The Beginning    
We kicked off preparations around September 2019. With no background in combat robotics, our learning started from the basics, hours of binge-watching BattleBots, analyzing what made certain designs powerful, and trying to figure out what might actually survive the arena.

It didn’t take long for us to notice a pattern: most bots we’d face would probably be drum spinners. To stand a chance, we needed something different. That’s when we discovered Son of Whyachi, a legendary BattleBots champion.

What made it special was its unique top-rotor design. Its weapon wasn’t just for offense, it doubled as defense. Since most robots are vulnerable to side impacts, Son of Whyachi’s spinning hammers made it brutally effective, often crippling opponents by knocking off wheels. Its design philosophy clicked instantly with us. If it could dominate at BattleBots, why not try something similar?

We decided to model our bot after it, naming it **Bramhaputra**, after the mighty river—powerful, relentless, and unstoppable.

<div class="row justify-content-sm-center">
  <!-- Image (left) -->
  <div class="col-sm-6 mt-3 mt-md-0">
    <figure>
      {% include figure.liquid path="assets/img/posts/2020-1-1-bramhaputra/son-of-wayachi.jpg" 
         title="The Son of Wayachi at the Battelbots-2019" 
         class="img-fluid rounded z-depth-1" %}
      <figcaption class="caption text-center mt-2">
        The legendary Son of Whyachi from BattleBots 2019
      </figcaption>
    </figure>
  </div>

  <!-- Video (right) -->
  <div class="col-sm-6 mt-3 mt-md-0">
    <figure>
      <div class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item"
          src="https://www.youtube.com/embed/v9VymPqBCCI"
          title="on of Whyachi vs. Ghost Raptor - BattleBots"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>
      <figcaption class="caption text-center mt-2">
        The Son of Wayachi in it's natural habitat
      </figcaption>
    </figure>
  </div>
</div>


## Building Bramhaputra

Our design featured a top-rotor with three hammers, spinning at high RPMs to deliver crushing impacts. The bot’s body was reinforced with tough steel armor for durability. For mobility, we used four aluminum wheels (two on each side), powered by high-torque DC motors. The weapon system was driven by an e-bike motor, providing both speed and brute force.

On the electronics side, we went with a 6-channel Flysky remote controller. An Arduino Nano handled signal processing from the receiver and controlled the motor drivers. We even designed a custom PCB to integrate everything neatly. All the high-current components (like motors for wheels and rotary hammer assembly) were powered by 4 Li-PO batteries, and all the control electronics were powered by a separate smaller Li-PO battery.

Here are some screenshots of the CAD model:
<swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true">
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad-final1.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad-final2.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad-final3.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad1.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad2.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad3.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad4.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad5.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad6.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad7.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad8.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/cad9.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
</swiper-container>

And here are some final images from days before the event:
<swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true">
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/photo1.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/photo2.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/posts/2020-1-1-bramhaputra/photo3.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
</swiper-container>

## Looking Back
For three freshers who had never built a robot before, Bramhaputra was more than just a machine, it was our crash course in robotics, teamwork, and problem-solving. It taught us that diving headfirst into the unknown can be daunting, but it’s also the fastest way to learn. 

Walking into the IIT Bombay arena with Bramhaputra, we knew we weren’t just competing for victory. We were there for the experience, for the thrill, and for the journey that started us on a path of making, breaking, and building again. We didn’t win the competition, but the experience itself was worth far more than a trophy. Every late night of building, every failure we patched, and every moment inside the arena taught us something new.  
