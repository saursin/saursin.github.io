---
layout: page
title: "VxDebug: Vortex Debug Extension"
description: External debug spec for Vortex GPGPU
img: assets/img/projects/vortex_debug/vortex_logo.png
category: work
pretty_table: true
toc:
  sidebar: left
tags:
  - Vortex
related_publications: false
---


The Vortex Debug Extension adds support for interactive debugging of programs running on RISC-V based GPUs such as 
[Vortex](https://vortex.cc.gatech.edu/). It provides a bridge between a debugger (such as GDB) and the GPU, exposing 
hardware state (registers, memory, warps, threads) through the standard GDB Remote Serial Protocol (RSP).

## Programming Model
Vortex is a GPGPU that uses a SIMT execution model. The smallest unit of computation is a *thread*. Multiple threads are 
grouped into *warps* that share a *program counter* (PC). These warps are further grouped into *blocks* (or tasks) that 
are dynamically scheduled on multiple vortex cores by the vortex runtime. 

## Hardware Architecture
Vortex is a highly paramatrized in-order issue and out-of-order commit architecture based on the RISC-V ISA. It supports
the GPU stack by implementing custom RISC-V instruction that allow spawning and managing threads. The Vortex core contain 
6 pipeline stages namely: schedule, fetch, decode, issue, execute, and commit. A thread on vortex owns a private 
32-register space in the register file. Multiple threads are grouped into a warp which sharing a program counter (PC). 
Each vortex core can hold multiple warp contexts. 

The schedule stage in Vortex is responsible for managing and scheduling these warps to the pipeline. Schedule stage keeps 
track of *active warps*, *stalled warps*, *per-warp PCs* and *per-warp thread masks*. Each cycle, a warp scheduler 
dynamically picks a warp from *active warps* for execution. As the scheduled warp propages through the pipeline, it fetches an instruction from I-Cache in fetch stage, decodes it in decode stage, and reads operands in the issue stage. The warps are issued to execute stage where they use 
multi-lane functional units for computation. Each thread in a warp is typically assigned a lane in the FU for computation. 
Finally the results are commited back to register file in the commit stage.

> The debug extension is not tied to vortex implementation in any way and can generally be reused for other similar architectures.

## Debug System Overview
Typically, Vortex GPGPU is connected to the host processor over the PCIe bus. A typical vortex program consists of 2
parts: 1) host code, and 2) kernel code. The host code is responsible for setting up the device side buffers, 
transferring data and launching the kernel. Vortex programs are compiled using 2 compilers, typically x86_64 on host
and riscv32/64 for vortex. When the program is launched, the host code talks to the vortex hardware over the PCI bus
through the vortex runtime to setup buffers and launch the kernel. When the kernel is launched, a debugger can be 
attached to the kernel to debug the kernel code. 


## Vortex Debug Extension
Vortex debug extension uses a lightweight Debug Module (DM) alongside the small debug logic in cores to support runtime software debugging. 

**Features:**
 - Can obtain all information about the platform automatically.
 - Supports upto 128 threads/warp, and upto 32k warps globally.
 - Supports batch halting/resuming.
 - Supports ability to halt warps after reset (allows debugging from first instruction).
 - Supports single warp stepping and *instruction injection* for arbitrary code execution.
 - *Supports reading/writing GPRs and CSRs.
 - *Supports reading/writing memory.
 - *Supports software breakpoints.

\* emulated in using instruction injection.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/vortex_debug/vxdbg_system.png" title="Vortex Debug System Overview" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Vortex Debug System Overview
</div>

## Selecting Warps
Vortex is a warp-based architecture, so the DM works at the warp level. DM can halt/resume/step individual warps. Warps 
from different cores in a vortex platform are tracked globally using a *global warp array* in the DM. The DM has the 
ability to select multiple warps to perform halt/resume operations. Furthermore, It can select a single warp to perform 
stepping and instruction injection. 

### Selecting Multiple Warps
DM maintains a *global warp status array* and a *global warp mask array* to support batch operaions. To select warps, 
the debugger uses `DSELECT.winsel` to select a 32-bit window in the global arrays, and writes `WMASK.mask` to select one 
or more warps. By setting/clearing bit `i` in the global mask array, warp with warpid=`i` can be selected/deselected. 
Once one or more warps are selected, All subsequent halt/resume operations target the selected warps. Debugger can also 
observe the halted state of one or more warps by using `DSELECT.winsel` to select a 32-bit window in the 
*global status array* and reading the window of status bits through `WSTATUS.status` (`1` means halted, `0` means active).

### Selecting a Single Warp/Thread
While the debug extension allows selecting multiple warps for halting/resuming, Only one warp can be selected for more 
targeted operations such as single stepping or observing warp/thread state. Debugger can select a single warp/thead by 
writing its global warp id to `DSELECT.warpsel` and warp-local thead-id to `DSELECT.threadsel`. All subsequent step and 
instruction injection commands then use the selected warp/thread pair. 


## Debug Module
The Debug Module (DM) is a small IP that resides in the vortex topmodule. It exposes a control register 
interface for the debugger host, separate from the program’s memory space. Debugger can access these registers through 
a debug medium such as JTAG to control and inspect the execution on the platform. 

**Features:**
 - Supports batch halting/resuming.
 - Supports ability to halt warps after reset (allows debugging from first instruction).
 - Supports single warp stepping and *instruction injection* for arbitrary code execution.
 - Supports reading/writing GPRs and CSRs (using instruction injection).
 - Supports reading/writing memory (using instruction injection).
 - Supports software emulated breakpoints.


### Debug Module Registers

| Addr    | Name          | Description                      |
|:-------:|:-------------:|:--------------------------------:|
| 0x0     | PLATFORM      | Platform information register    |
| 0x1     | DCONFIG       | Debug configuration register     |
| 0x2     | DSELECT       | Debug selection register         |
| 0x3     | WMASK         | Warp mask register               |
| 0x4     | WACTIVE       | Warp active register             |
| 0x5     | WSTATUS       | Warp status register             |
| 0x6     | DCTRL         | Debug Control Register           |
| 0x7     | DPC           | Debug Program Counter Register   |
| 0x8     | INJECT        | Instruction Injection Register   |
| 0x9-0xc | DSCRATCH[0-3] | Debug Scratch Registers (upto-4) |


#### 0x0: PLATFORM: Platform Information Register

```wavedrom
{reg: [
    {bits: 3,  name: 'numthreads', attr: ['3']},
    {bits: 9,  name: 'numwarps', attr: ['9']},
    {bits: 9,  name: 'numcores', attr: ['9']},
    {bits: 7,  name: 'numclusters', attr: ['7']},
    {bits: 4,  name: 'platformid', attr: ['4']}
], config:{fontsize: 12}}
```

| Subfield    | Width | Access  | Description |
|:-----------:|:-----:|:-------:|:-----------:|
| platformid  | 4     | R       | Platform ID |
| numclusters | 7     | R       | Number of clusters (Upto 128) |
| numcores    | 9     | R       | Number of cores/cluster (Upto 512) |
| numwarps    | 9     | R       | Number of warps/core (Upto 512) |
| numthreads  | 3     | R       | $log_2$ number of threads/warp (Upto 128) |

> Vortex uses PlatformID = `4'b0001`

#### 0x1: DCONFIG: Debug Config Register

```wavedrom
{reg: [
    {bits: 1, name: 'EH', attr: ['1']},
    {bits: 25, name: 'reserved', attr: ['25']},
    {bits: 3, name: 'RHC', attr: ['3']},
    {bits: 3, name: 'NRC', attr: ['3']},
], config: {fontsize: 12}}
```

| Subfield                | Width | Access  | Description |
|:-----------------------:|:-----:|:-------:|:-----------:|
| ndmresetcycles(NRC)     | 3     | RW      | $log_2$ power of 2 cycles to assert ndmreset<br> 3 bits = 0x0-0x7 --> $2^0$ to $2^7$ cycles |
| resethaltreqcycles(NRC) | 3     | RW      | $log_2$ number of cycles to assert resethaltreq<br> 3 bits = 0x0-0x7 --> $2^0$ to $2^7$ cycles |
| ebreakh (EH)            | 1     | RW      | Enable ebreak halt |

> To reduce register width, the cycle count is encoded as an exponent of 2 (i.e., cycles = 2^NRC)

#### 0x2: DSELECT: Debug Select Register

```wavedrom
{reg: [
    {bits: 7, name: 'threadsel', attr: ['7']},
    {bits: 15, name: 'warpsel', attr: ['15']},
    {bits: 10, name: 'winsel', attr: ['10']},
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| winsel    | 10    | RW      | Selects which 32-bit window of warp status/mask array is accessed |
| warpsel   | 15    | RW      | Selects warp to debug (global Warp-id) |
| threadsel | 7     | RW      | Selects thread to debug (warp local thread-id) |

> Upto 128 threads/warps supported. Upto 32k total warps can be debugged globally.

#### 0x3: WMASK: Warp Mask Register

```wavedrom
{reg: [
    {bits: 32, name: 'mask', attr: ['32']}
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| mask      | 32    | RW      | Warp mask for selected window <br> (bit[n]=1 means warp n is selected) |


#### 0x4: WACTIVE: Warp Active Status Register

```wavedrom
{reg: [
    {bits: 32, name: 'astatus', attr: ['32']}
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| astatus   | 32    | R       | warp active bits for selected window <br> (bit[n]=1 means warp n is active) |


#### 0x5: WSTATUS: Warp Status Register

```wavedrom
{reg: [
    {bits: 32, name: 'status', attr: ['32']}
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| status    | 32    | R       | warp status for selected window <br> (bit[n]=1 means warp n is halted) |


#### 0x6: DCTRL: Debug Control Register

```wavedrom
{reg: [
    {bits: 1, name: 'HR', attr: ['1']},
    {bits: 1, name: 'RR', attr: ['1']},
    {bits: 1, name: 'RHR', attr: ['1']},
    {bits: 1, name: 'SR', attr: ['1']},
    {bits: 2, name: 'SST', attr: ['2']},
    {bits: 1, name: 'IR', attr: ['1']},
    {bits: 2, name: 'IST', attr: ['2']},
    {bits: 3, name: 'HC', attr: ['3']},
    {bits: 12, name: 'reserved', attr: ['12']},
    {bits: 1, name: 'NU', attr: ['1']},
    {bits: 1, name: 'AU', attr: ['1']},
    {bits: 1, name: 'NR', attr: ['1']},
    {bits: 1, name: 'AR', attr: ['1']},
    {bits: 1, name: 'NH', attr: ['1']},
    {bits: 1, name: 'AH', attr: ['1']},
    {bits: 1, name: 'NT', attr: ['1']},
    {bits: 1, name: 'DA', attr: ['1']}
], config:{fontsize: 12}}
```

| Subfield         | Width | Access  | Description |
|:----------------:|:-----:|:-------:|:-----------:|
| dmactive (DA)     | 1     | RW      | write 1 to enable debug module, when 0, all debug module registers are reset |
| ndmreset (NT)     | 1     | RW      | write 1 to assert ndmreset output for `NDMRESET_CYCLES` cycles, Read returns 1 if ndmreset is currently asserted |
| allhalted (AH)    | 1     | R       | All warps are halted |
| anyhalted (NH)    | 1     | R       | Any warps are halted |
| allrunning (AR)   | 1     | R       | All warps are running |
| anyrunning (NR)   | 1     | R       | Any warps are running |
| allunavail (AU)   | 1     | R       | All warps are unavailable |
| anyunavail (NU)   | 1     | R       | Any warps are unavailable |
| hacause (HC)      | 3     | R       | Shows halt cause of currently selected warp <br> (3b000: NONE, 3b001: EBREAK, 3b010: HALTREQ, 3b011: STEP, 3b100: RESETHALTREQ)
| injectstate (IST) | 2     | R       | Shows status of instruction inject request <br> (2b00: NONE, 2b01: REQ, 2b10: INFLIGHT) | 
| injectreq (IR)    | 1     | W       | write 1 to inject an instruction (`INJECT.instr`) in warp selected by `DSELECT.warpsel` and thread selected by `DSELECT.threadsel` |
| stepstate (SST)   | 2     | R       | Shows status of step request <br> (2b00: NONE, 2b01: REQ, 2b10: INFLIGHT) | 
| stepreq (SR)      | 1     | W       | write 1 to step warp selected by `DSELECT.warpsel` |
| resethaltreq (RHR) | 1     | W       | Write 1 and assert `ndmreset` to halt selected warps right after reset | 
| resumereq (RR)    | 1     | W       | write 1 to resume all selected warps in *global warp array* |
| haltreq (HR)      | 1     | W       | write 1 to halt all selected warps *global warp array* |

> Its acceptable to report hacause as HALTREQ on a RESETHALTREQ to simplify things.

#### 0x7: DPC: Debug Program Counter Register

```wavedrom
{reg: [
    {bits: 32, name: 'pc', attr: ['32']}
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| pc        | 32    | RW      | Program counter of the warp selected by `DSELECT.warpsel` <br> value is valid if warp is halted |


#### 0x8: INJECT: Instruction Injection Register
```wavedrom
{reg: [
    {bits: 32, name: 'instr', attr: ['32']}
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| instr     | 32    | RW      | Instruction to be injected when `DCTRL.injectreq` is asserted |


#### 0x9-0xc: DSCRATCH0-3: Debug Scratch Registers

```wavedrom
{reg: [
    {bits: 32, name: 'data', attr: ['32']}
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| data      | 32    | RW      | data |

> DSCRATCH register is exposed to core as a per-thread CSR register. It can also be read/written by the debugger through backdoor access. 

