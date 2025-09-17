---
layout: page
title: Vortex Debug Extension
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

## Vortex Debug Extension
The extension adds a lightweight Debug Module (DM) alongside the GPU cores to support runtime software debugging. 

## Debug Module
The Debug Module (DM) is a small peripheral block that resides in the vortex topmodule. It exposes a control register 
interface for the debugger host, separate from the program’s memory space. Debugger can access these registers through 
a debug medium such as JTAG to control and inspect the execution on the platform. 

**Features:**
 - Supports upto 128 threads/warp, and upto 32k warps globally.
 - Supports batch halting/resuming.
 - Supports single warp stepping/instruction injection.
 - Supports reading/writing GPRs and CSRs (using instruction injection).
 - Supports reading/writing memory (using instruction injection).


### Register Map

| Addr | Name      | Description                    |
|:----:|:---------:|:------------------------------:|
| 0x0  | PLATFORM  | Platform information register  |
| 0x1  | DSELECT   | Debug selection register       |
| 0x2  | WMASK     | Warp mask register             |
| 0x3  | WSTATUS   | Warp status register           |
| 0x4  | DCTRL     | Debug Control Register         |
| 0x5  | INJECT    | Instruction Injection Register |
| 0x6  | DSCRATCH  | Debug Scratch Register         |


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
| numthreads  | 3     | R       | $log_2$ number of threads/warp (Upto 256) |
| numwarps    | 9     | R       | Number of warps/core (Upto 512) |
| numcores    | 9     | R       | Number of cores/cluster (Upto 512) |
| numclusters | 7     | R       | Number of clusters (Upto 128) |
| platformid  | 4     | R       | Platform ID <br> (vortex = `4'b0001`) |

#### 0x1: DSELECT: Debug Select Register

```wavedrom
{reg: [
    {bits: 7, name: 'threadsel', attr: ['7']},
    {bits: 15, name: 'warpsel', attr: ['15']},
    {bits: 10, name: 'windsel', attr: ['10']},
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| threadsel | 7     | RW      | Selects thread to debug (warp local thread-id) |
| warpsel   | 15    | RW      | Selects warp to debug (global Warp-id) |
| winsel    | 10    | RW      | Selects which 32-bit window of warp status/mask array is accessed |

> Upto 128 threads/warps supported. Upto 32k total warps can be debugged globally.

#### 0x2: WMASK: Warp Mask Register

```wavedrom
{reg: [
    {bits: 32, name: 'mask', attr: ['32']}
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| mask      | 32    | RW      | Warp mask for selected window <br> (bit[n]=1 means warp n is selected for halt/resume) |


#### 0x3: WSTATUS: Warp Status Register

```wavedrom
{reg: [
    {bits: 32, name: 'status', attr: ['32']}
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| status    | 32    | R       | warp status for selected window <br> (bit[n]=1 means warp n is halted) |


#### 0x4: DCTRL: Debug Control Register

```wavedrom
{reg: [
    {bits: 1, name: 'HR', attr: ['1']},
    {bits: 1, name: 'RR', attr: ['1']},
    {bits: 1, name: 'SR', attr: ['1']},
    {bits: 2, name: 'SST', attr: ['2']},
    {bits: 1, name: 'IR', attr: ['1']},
    {bits: 2, name: 'IST', attr: ['2']},
    {bits: 18, name: 'reserved', attr: ['18']},
    {bits: 4, name: 'NRC', attr: ['4']},
    {bits: 1, name: 'NR', attr: ['1']},
    {bits: 1, name: 'DA', attr: ['1']}
], config:{fontsize: 12}}
```

| Subfield         | Width | Access  | Description |
|:----------------:|:-----:|:-------:|:-----------:|
| haltreq (HR)     | 1     | W       | write 1 to halt all selected warps *global warp array* |
| resumereq (RR)   | 1     | W       | write 1 to resume all selected warps in *global warp array* |
| stepreq (SR)     | 1     | W       | write 1 to step warp selected by `DSELECT.warpsel` |
| stepstate (SST)  | 2     | R       | Shows status of step request <br> (2b00: NONE, 2b01: REQ, 2b10: INFLIGHT) | 
| injectreq (IR)   | 1     | W       | write 1 to inject an instruction (`INJECT.instr`) in warp selected by `DSELECT.warpsel` and thread selected by `DSELECT.threadsel` |
| injectstate (IST)| 2     | R       | Shows status of instruction inject request <br> (2b00: NONE, 2b01: REQ, 2b10: INFLIGHT) | 
| ndmresetcyc (NRC)| 4     | RW      | $log_2$ number of cycles ndmreset is asserted |
| ndmreset (NR)    | 1     | RW      | write 1 to assert ndmreset output for `ndmresetcyc` cycles, Read returns 1 if ndmreset is currently asserted |
| dmactive (DA)    | 1     | RW      |  write 1 to enable debug module, when 0, all debug module registers are reset |

#### 0x5: INJECT: Instruction Injection Register
```wavedrom
{reg: [
    {bits: 32, name: 'instr', attr: ['32']}
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| instr     | 32    | RW      | Instruction to be injected when `DCTRL.injectreq` is asserted |

#### 0x6: DSCRATCH: Debug Scratch Register
DSCRATCH register is exposed to core as a per-thread CSR register. It can also be read/written by the debugger through backdoor access. 

```wavedrom
{reg: [
    {bits: 32, name: 'data', attr: ['32']}
], config:{fontsize: 12}}
```

| Subfield  | Width | Access  | Description |
|:---------:|:-----:|:-------:|:-----------:|
| data      | 32    | RW      | data |






<!-- ### Warp/Thread Selection
Vortex is a warp-based architecture, so the DM works at the warp level. DM can halt/resume/step individual warps. Each core
provides halt status bits for each of their warps which are concatenated in the DM to for a *halted warp status* array. 
`WSEL.winsel` selects a 32-bit window on which halt/resume operations occur. `WSTATUS.status` shows the status of warps 
in currently selected window. (`1` means halted, `0` means active). `WSEL.warpsel` is used to select a single warp to 

Warp status and mask from all cores are concatenated to form a *global warp array*. A window in *global warp array* is selected using `DSELECT.winsel` which allows reading status bits from `WSTATUS.status` and writing mask bits to `WMASK.mask`. Halt/resume commands apply to all warps selected in *global warp array*. 

Individual warps can be debugged one at a time. To select a warp, global warp ID of the warp to be debugged should be written to `DSELECT.warpsel`. Similarily, A thread can be selected by writing a warp-local thread ID to `DSELECT.threadsel`.


 -->

<!-- 
### Halting/Resuming

### Single Stepping

### Reading/Writing GPRs & CSRs

### Reading/Writing Memory



## Adding Debug Mode

## Interfacing Debug Module with Vortex

## Writing the Debugger -->
