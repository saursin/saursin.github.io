---
layout: page
title: RISC-V Atom
description: An open-source 32-bit RISC-V soft-core processor.
img: assets/img/projects/riscv-atom/atom_icon.png
importance: 1
category: work
related_publications: false
---

RISC-V Atom project consists of an embedded-class soft-core processor and a complete software development environment built around it. RISC-V Atom is proven on silicon in the form of HydrogenSoC, which has been tested on Spartan-6, Cyclone-V, DE0-CV and Sipeed Tang Primer 20K FPGA boards.


**This project is open-source under the MIT license!**


- [Github Repository](https://github.com/saursin/riscv-atom)
- [Documentation](https://riscv-atom.readthedocs.io/en/latest/)


## RISC-V Atom Core
Atom is a 32-bit embedded-class softcore processor written in Verilog HDL. It is designed to cater to embedded-class applications. It is fully compliant with the open-source RISC-V Instruction Set Architecture (RV32IC) and passes all official RISC-V compliance tests. Atom is based on a two-stage pipelined architecture inspired by the ARM Cortex m0+ processor. It also includes support for RISC-V Interrupts and exceptions. Features in Atom can be enabled or disabled depending on the requirements. 

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="https://riscv-atom.readthedocs.io/en/latest/_images/RISCVAtom_arch.png" title="RISC-V Atom Architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    RISC-V Atom Architecture
</div>

## AtomSim
AtomSim is a multi-target SoC simulation framework written in C++. AtomSim provides a hardware-software co-simulation environment for developing applications and extensions on the Atom platform. It uses the Verilator tool to compile the RTL, which is then linked with the C++-based simulator frontend to simulate the system. The main highlight of AtomSim is a command-line interface to control various aspects of the simulation.  Following is a list of commands that AtomSim supports:
- General commands: set verbosity, enable/disable VCD trace, help, quit, etc.
- Control commands: reset, step, run for specified cycles, run indefinitely, set breakpoint, etc.
- Query commands: info, dump memory contents, load a binary file at the specified address, etc. 
AtomSim also provides information such as register values, instruction disassembly, and current context to aid with debugging. Moreover, AtomSim is designed to be modular with a clearly defined API between the frontend and backend, which makes it extendable to other processors. 


<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/riscv-atom/atomsim-console.png" title="AtomSim Console" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    AtomSim Console
</div>


## SCAR
SCAR (Search, Compile, Assert, and Run) is a processor verification framework written in Python. It performs a set of assembly-level tests to verify the processor implementation. Each assembly test usually checks for one particular function of the processor. SCAR does this by examining a state dump after the processor is done executing a test code. This state dump is checked against a set of assertions, generating a final report (as shown to the right). SCAR is also used to verify the RISC-V ISA compliance in this project.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/riscv-atom/scar-report.png" title="SCAR Report" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    SCAR Report
</div>


## HydrogenSoC
It is a full SoC implementation that contains a single Atom core along with memories, UART, GPIOs, and timers. All the peripherals are connected to the CPU using a Wishbone-B4 bus. Users have the flexibility to disable or enable core features, include IPs, and set memory maps through a config JSON file. 
HydrogenSoC is also proven on Altera and Xilinx FPGAs.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="https://riscv-atom.readthedocs.io/en/latest/_images/HydrogenSoC.png" title="HydrogenSoC Architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    HydrogenSoC Architecture
</div>


## RISC-V Atom in Action!
Blinky example showcasing the RISC-V Atom processor implemented in HydrogenSoC on the Altera DE0-CV board

<iframe width="560" height="315"
  src="https://www.youtube.com/embed/diJk-EwFnTs"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen>
</iframe>

