---
layout: post
title: 'Towards Better Row-Hammer Mitigation through Dynamic Aggressor Row Quarantining'
date: 2023-12-23
tags:
  - interview
---

Dynamic Random Access Memory (DRAM) is the memory technology of choice for main memory in any computing system from personal handheld devices like smartphones to High-Performance Computing (HPC) data centers. DRAM offers a relatively high storage density as compared to Static Random Access Memory (SRAM) at a fraction of the cost. But as manufacturers try to scale down the DRAM cells, we see new vulnerabilities that make DRAM susceptible to a wide range of attacks. We are talking about corrupting critical data, recovering encryption keys, and getting super-user privileges in a system. 

Recently, I got a chance to sit down with Prof. Moinuddin Qureshi, a professor at the School of Computer Science at Georgia Tech, to chat about these vulnerabilities and his recent paper, “AQUA: Scalable Rowhammer Mitigation by Quarantining Aggressor Rows at Runtime”. 


## DRAM, what’s that? 
Let’s take a step back and understand how DRAM works. A DRAM module (Fig. 1) is nothing but a set of DRAM chips, each of them containing billions of DRAM cells organized into 2-D arrays. Each DRAM cell (Fig. 2) is comprised of a transistor and a capacitor. A bit (1 or 0) is stored as a charge on this capacitor. To read data, the corresponding row is activated, which brings the data to a row buffer, which is then sent to the memory controller.

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/posts/2023-12-23-moinuddin-qureshi-interview/dram.png" title="DRAM" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/posts/2023-12-23-moinuddin-qureshi-interview/dram_cell.png" title="DRAM Cell" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

## So, what is Rowhammer Vulnerability? 
Capacitors in the real world are leaky; therefore, each activation of row X leaks a little bit of charge from the neighboring rows (X-1, X+1). It’s not a problem in the usual scenario because the DRAM controller issues a refresh, usually every 64 ms (aka Refresh Interval), to replenish these charges. But if you activate row X a lot of times within a refresh interval, due to excessive charge leakage, the bits in rows X-1 and X+1 flip! (Fig. 3). This is called a Rowhammer attack.

Conventional mitigation schemes track the number of activations for a row and either refresh the neighboring rows, e.g., Victim Refresh (VR), or migrate the aggressor row, e.g., Randomized Row Swap (RRS) if the number of activations reaches a certain threshold. But recent attacks like Google’s Half-Double attack, use the mitigative action on rows X-1 and X+1 itself to cause bit-flips in rows X-2 and X+2. Conversation with Prof. Moin revealed that Google’s Half Double attack motivated him to return to Rowhammer mitigation research and served as the motivation for AQUA. 

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/posts/2023-12-23-moinuddin-qureshi-interview/rowhammer.png" title="Rowhammer Attack" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Rowhammer Attack
</div>

## How does AQUA work, and how is it different from the existing schemes?
AQUA proves to be a better mitigative strategy because, unlike previous methods, AQUA tries to break the spatial correlation between aggressor and victims, by designating a small logical quarantine region in DRAM where the aggressor rows get migrated. Furthermore, it doesn’t require the location of migrated rows to be a secret since, if hammering continues, AQUA moves it again to some other location in the quarantine region. 

## Where do we stand in mitigating these Vulnerabilities? What’s the industry’s stance on this?
Prof. explained, “Moore’s law is not dying. It's just giving us worse and worse, crappier transistors. And then the challenge really becomes how do you make a secure system with these crappy transistors”. The industry is mostly silent on the Rowhammer vulnerability. CPU manufacturers (Intel & AMD) want DRAM manufacturers to fix it, while they argue against doing so because it would be too expensive. Currently available DRAMs are broken to a point where even the memory standard, JEDEC issued a white paper saying that the deployed mitigations will not handle all the attack patterns. 

> "We're in an interesting time when there's a game of hot potato being thrown from one side to the other." – Prof. Moin 

## A bit more about Prof. Moin and his advice for new PhD students
Prof. Moin worked at IBM before becoming a professor. He mentioned that in the industry, sooner or later, the focus diverts to something that makes money. On the other hand, Academia gives you the freedom to choose your own topic and explore even the seemingly abstract ideas that may never get funding and approval in the industry. The main purpose of academia is to develop insights, rather than a product. Secondly, he enjoys being in academia because, according to him, “students bring a wave of creativity and fresh ideas that keeps you young”. Prof. Moin advises new Ph.D. students to learn how to conduct research, come up with problems, and insights, and analyze solutions in the first couple of years instead of jumping into a rabbit hole of getting something published. I asked how to deal with all the self-doubt in the face of all the incredible things your peers are publishing, to which he responded, “Don't judge yourself by where they are now, judge yourself by where they were at your time”. 