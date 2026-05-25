<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  const BUDGET = 40;
  const MAX_PLAYERS = 9;
  const STADIUM_PRICE = 3;
  const EMPTY = '_';

  const characterData: Array<{ name: string; price: number }> = [
    { name: "Mario",          price: 7  },
    { name: "Luigi",          price: 6  },
    { name: "DK",             price: 10 },
    { name: "Diddy",          price: 4  },
    { name: "Peach",          price: 5  },
    { name: "Daisy",          price: 4  },
    { name: "Yoshi",          price: 8  },
    { name: "Baby Mario",     price: 2  },
    { name: "Baby Luigi",     price: 2  },
    { name: "Bowser",         price: 12 },
    { name: "Wario",          price: 7  },
    { name: "Waluigi",        price: 7  },
    { name: "Koopa(G)",       price: 1  },
    { name: "Toad(R)",        price: 4  },
    { name: "Boo",            price: 6  },
    { name: "Toadette",       price: 3  },
    { name: "Shy Guy(R)",     price: 2  },
    { name: "Birdo",          price: 8  },
    { name: "Monty",          price: 1  },
    { name: "Bowser Jr",      price: 3  },
    { name: "Paratroopa(R)",  price: 1  },
    { name: "Pianta(B)",      price: 4  },
    { name: "Pianta(R)",      price: 5  },
    { name: "Pianta(Y)",      price: 4  },
    { name: "Noki(B)",        price: 3  },
    { name: "Noki(R)",        price: 3  },
    { name: "Noki(G)",        price: 6  },
    { name: "Bro(H)",         price: 9  },
    { name: "Toadsworth",     price: 5  },
    { name: "Toad(B)",        price: 4  },
    { name: "Toad(Y)",        price: 4  },
    { name: "Toad(G)",        price: 4  },
    { name: "Toad(P)",        price: 4  },
    { name: "Magikoopa(B)",   price: 8  },
    { name: "Magikoopa(R)",   price: 8  },
    { name: "Magikoopa(G)",   price: 8  },
    { name: "Magikoopa(Y)",   price: 8  },
    { name: "King Boo",       price: 8  },
    { name: "Petey",          price: 10 },
    { name: "Dixie",          price: 4  },
    { name: "Goomba",         price: 1  },
    { name: "Paragoomba",     price: 1  },
    { name: "Koopa(R)",       price: 2  },
    { name: "Paratroopa(G)",  price: 5  },
    { name: "Shy Guy(B)",     price: 2  },
    { name: "Shy Guy(Y)",     price: 2  },
    { name: "Shy Guy(G)",     price: 2  },
    { name: "Shy Guy(Bk)",    price: 2  },
    { name: "Dry Bones(Gy)",  price: 2  },
    { name: "Dry Bones(G)",   price: 5  },
    { name: "Dry Bones(R)",   price: 2  },
    { name: "Dry Bones(B)",   price: 2  },
    { name: "Bro(F)",         price: 9  },
    { name: "Bro(B)",         price: 9  },
  ];

  const priceMap: Record<string, number> = Object.fromEntries(
    characterData.map(c => [c.name, c.price])
  );

  // Encode/decode roster using character IDs (0–53) for compact share URLs
  const nameToId: Record<string, number> = Object.fromEntries(
    characterData.map((c, i) => [c.name, i])
  );
  const idToName: Record<number, string> = Object.fromEntries(
    characterData.map((c, i) => [i, c.name])
  );

  // Field positions: array index === roster slot
  const fieldPositions = [
    { label: 'P',  name: 'Pitcher',      x: 50, y: 63 },
    { label: 'C',  name: 'Catcher',      x: 50, y: 86 },
    { label: '1B', name: 'First Base',   x: 74, y: 58 },
    { label: '2B', name: 'Second Base',  x: 62, y: 42 },
    { label: '3B', name: 'Third Base',   x: 26, y: 58 },
    { label: 'SS', name: 'Shortstop',    x: 38, y: 42 },
    { label: 'LF', name: 'Left Field',   x: 18, y: 26 },
    { label: 'CF', name: 'Center Field', x: 50, y: 18 },
    { label: 'RF', name: 'Right Field',  x: 82, y: 26 },
  ];

  // Roster is a fixed 9-slot array; null = empty. Index === field position.
  let roster: (string | null)[] = Array(MAX_PLAYERS).fill(null);
  // lineupOrder is a permutation of 0–8; lineup view shows roster[lineupOrder[i]] at slot i+1.
  let lineupOrder: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  let stadiumPicked = false;
  let search = '';
  let sortBy: 'price-desc' | 'price-asc' | 'name' | 'tier' = 'tier';
  let copied = false;
  let rosterView: 'lineup' | 'field' = 'lineup';

  // Drag state (field view)
  let dragFrom: number | null = null;
  let dragOver: number | null = null;

  // Drag state (lineup view) — operates on lineupOrder indices
  let lineupDragFrom: number | null = null;
  let lineupDragOver: number | null = null;

  $: filledCount = roster.filter(Boolean).length;
  $: spent = roster.reduce((sum, name) => sum + (name ? priceMap[name] : 0), 0) + (stadiumPicked ? STADIUM_PRICE : 0);
  $: remaining = BUDGET - spent;
  $: rosterFull = filledCount >= MAX_PLAYERS;
  $: budgetPct = Math.min(100, (spent / BUDGET) * 100);

  $: filtered = characterData
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-desc' || sortBy === 'tier') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

  $: tiers = sortBy === 'tier'
    ? [...new Set(filtered.map(c => c.price))].sort((a, b) => b - a)
    : [];

  function canAfford(price: number): boolean {
    return !rosterFull && spent + price <= BUDGET;
  }

  function addCharacter(name: string) {
    if (!canAfford(priceMap[name])) return;
    const idx = roster.findIndex(s => s === null);
    if (idx === -1) return;
    roster = roster.map((s, i) => i === idx ? name : s);
  }

  function removeAt(i: number) {
    roster = roster.map((s, idx) => idx === i ? null : s);
  }

  // Drag handlers (field view only)
  function onDragStart(i: number, e: DragEvent) {
    if (!roster[i]) { e.preventDefault(); return; }
    dragFrom = i;
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(i: number, e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    dragOver = i;
  }

  function onDrop(i: number, e: DragEvent) {
    e.preventDefault();
    if (dragFrom === null || dragFrom === i) { dragFrom = null; dragOver = null; return; }
    const next = [...roster];
    [next[dragFrom], next[i]] = [next[i], next[dragFrom]];
    roster = next;
    // Keep lineup slots pointing to the same characters by swapping the index references
    const from = dragFrom;
    lineupOrder = lineupOrder.map(idx => idx === from ? i : idx === i ? from : idx);
    dragFrom = null;
    dragOver = null;
  }

  function onDragEnd() {
    dragFrom = null;
    dragOver = null;
  }

  // Lineup drag handlers — reorders lineupOrder, not roster
  function onLineupDragStart(li: number, e: DragEvent) {
    lineupDragFrom = li;
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  }

  function onLineupDragOver(li: number, e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    lineupDragOver = li;
  }

  function onLineupDrop(li: number, e: DragEvent) {
    e.preventDefault();
    if (lineupDragFrom === null || lineupDragFrom === li) { lineupDragFrom = null; lineupDragOver = null; return; }
    const next = [...lineupOrder];
    [next[lineupDragFrom], next[li]] = [next[li], next[lineupDragFrom]];
    lineupOrder = next;
    lineupDragFrom = null;
    lineupDragOver = null;
  }

  function onLineupDragEnd() { lineupDragFrom = null; lineupDragOver = null; }

  function reset() {
    roster = Array(MAX_PLAYERS).fill(null);
    lineupOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    stadiumPicked = false;
    copied = false;
  }

  function shareDraft() {
    const encoded = roster.map(s => s != null ? nameToId[s] : EMPTY).join(',');
    const params = new URLSearchParams({ r: encoded, lo: lineupOrder.join(',') });
    if (stadiumPicked) params.set('s', '1');
    const url = `${window.location.origin}/muddyball?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 2000);
    });
  }

  onMount(() => {
    const r = $page.url.searchParams.get('r');
    if (r) {
      const slots = r.split(',').slice(0, MAX_PLAYERS).map(s => {
        if (s === EMPTY) return null;
        const name = idToName[Number(s)];
        return name ?? null;
      });
      let total = $page.url.searchParams.get('s') === '1' ? STADIUM_PRICE : 0;
      roster = slots.map(name => {
        if (!name) return null;
        if (total + priceMap[name] <= BUDGET) { total += priceMap[name]; return name; }
        return null;
      });
    }
    const lo = $page.url.searchParams.get('lo');
    if (lo) {
      const parsed = lo.split(',').map(Number);
      if (parsed.length === MAX_PLAYERS && parsed.every(n => n >= 0 && n < MAX_PLAYERS)) {
        lineupOrder = parsed;
      }
    }
    if ($page.url.searchParams.get('s') === '1') stadiumPicked = true;
  });
</script>

<div class="flex flex-col lg:flex-row gap-6">

  <!-- Draft Board (left) -->
  <div class="shrink-0 transition-all duration-300 {rosterView === 'field' ? 'lg:w-[28rem]' : 'lg:w-72'}">
    <div class="card p-4 space-y-3 lg:sticky lg:top-4">
      <h2 class="h3">Draft Board</h2>

      <!-- Budget meter -->
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span class="font-medium">Budget</span>
          <span
            class="font-mono font-bold"
            class:text-success-500={remaining > 5}
            class:text-warning-500={remaining <= 5 && remaining >= 0}
            class:text-error-500={remaining < 0}
          >
            ${remaining} left
          </span>
        </div>
        <div class="w-full bg-surface-300-600-token rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            class:bg-success-500={remaining > 5}
            class:bg-warning-500={remaining <= 5 && remaining >= 0}
            class:bg-error-500={remaining < 0}
            style="width: {budgetPct}%"
          />
        </div>
        <div class="text-xs text-surface-400-500-token mt-1">${spent} / ${BUDGET} · {filledCount}/{MAX_PLAYERS} players</div>
      </div>

      <!-- View tabs -->
      <div class="flex rounded-lg overflow-hidden border border-surface-400-500-token text-sm">
        <button
          class="flex-1 py-1.5 transition-colors {rosterView === 'lineup' ? 'variant-filled-primary' : 'hover:variant-soft-surface'}"
          on:click={() => (rosterView = 'lineup')}
        >Lineup</button>
        <button
          class="flex-1 py-1.5 transition-colors {rosterView === 'field' ? 'variant-filled-primary' : 'hover:variant-soft-surface'}"
          on:click={() => (rosterView = 'field')}
        >Field</button>
      </div>

      <!-- Lineup view -->
      {#if rosterView === 'lineup'}
        <div class="space-y-1">
          {#each lineupOrder as rosterIdx, li}
            {@const name = roster[rosterIdx]}
            {@const isDragSource = lineupDragFrom === li}
            {@const isDragTarget = lineupDragOver === li && lineupDragFrom !== null && lineupDragFrom !== li}
            <div
              draggable="true"
              role="listitem"
              class="flex items-center gap-2 p-1.5 rounded-lg transition-all cursor-grab active:cursor-grabbing select-none
                {name ? 'bg-surface-200-700-token' : 'border border-dashed border-surface-400-500-token opacity-50'}
                {isDragSource ? 'opacity-40 scale-95' : ''}
                {isDragTarget ? 'ring-2 ring-primary-500 scale-[1.02]' : ''}"
              on:dragstart={(e) => onLineupDragStart(li, e)}
              on:dragover={(e) => onLineupDragOver(li, e)}
              on:dragleave={() => { if (lineupDragOver === li) lineupDragOver = null; }}
              on:drop={(e) => onLineupDrop(li, e)}
              on:dragend={onLineupDragEnd}
            >
              <span class="text-surface-400-500-token shrink-0 text-sm leading-none">⠿</span>
              <span class="text-xs text-surface-400-500-token w-4 shrink-0">{li + 1}</span>
              {#if name}
                <img src="/images/Characters/{name}.png" alt={name} class="w-7 h-7 object-contain shrink-0" />
                <span class="flex-1 text-xs truncate">{name}</span>
                <span class="text-xs font-mono text-primary-400">${priceMap[name]}</span>
                <button
                  class="btn btn-icon-sm variant-ghost-error text-xs w-5 h-5 leading-none"
                  on:click={() => removeAt(rosterIdx)}
                  aria-label="Remove {name}"
                >✕</button>
              {:else}
                <div class="w-7 h-7 rounded bg-surface-300-600-token" />
                <span class="text-xs text-surface-400-500-token">empty</span>
              {/if}
            </div>
          {/each}
        </div>

      <!-- Field view -->
      {:else}
        <div
          class="relative w-full rounded-lg overflow-hidden select-none"
          style="aspect-ratio: 1 / 1;"
        >
          <!-- Field SVG background -->
          <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <rect width="100" height="100" fill="#2d6a4f"/>
            <!-- Infield dirt -->
            <polygon points="50,36 74,60 50,84 26,60" fill="#c8a97e"/>
            <!-- Pitcher mound -->
            <circle cx="50" cy="60" r="3" fill="#b8956e"/>
            <!-- Base paths outline -->
            <polygon points="50,36 74,60 50,84 26,60" fill="none" stroke="#a07850" stroke-width="0.5"/>
            <!-- Bases -->
            <rect x="48" y="34" width="4" height="4" fill="white" rx="0.5"/>
            <rect x="72" y="58" width="4" height="4" fill="white" rx="0.5"/>
            <polygon points="48,82 52,82 52,85 50,87 48,85" fill="white"/>
            <rect x="24" y="58" width="4" height="4" fill="white" rx="0.5"/>
          </svg>

          <!-- Position slots -->
          {#each fieldPositions as pos, i}
            {@const name = roster[i]}
            {@const isDragSource = dragFrom === i}
            {@const isDragTarget = dragOver === i && dragFrom !== null && dragFrom !== i}
            <div
              class="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style="left: {pos.x}%; top: {pos.y}%;"
              draggable={name ? 'true' : 'false'}
              role="button"
              tabindex="0"
              aria-label="{pos.label}: {name ?? 'empty'}"
              on:dragstart={(e) => onDragStart(i, e)}
              on:dragover={(e) => onDragOver(i, e)}
              on:dragleave={() => { if (dragOver === i) dragOver = null; }}
              on:drop={(e) => onDrop(i, e)}
              on:dragend={onDragEnd}
              on:keydown={(e) => { if ((e.key === 'Delete' || e.key === 'Backspace') && name) removeAt(i); }}
            >
              {#if name}
                <button
                  class="flex flex-col items-center gap-0.5 group transition-all
                    {isDragSource ? 'opacity-40 scale-90' : ''}
                    {isDragTarget ? 'scale-110' : ''}"
                  on:click={() => removeAt(i)}
                  title="Drag to move · Click to remove ({pos.name})"
                >
                  <div
                    class="rounded-full p-0.5 transition-all
                      {isDragTarget ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : ''}"
                  >
                    <img
                      src="/images/Characters/{name}.png"
                      alt={name}
                      class="w-9 h-9 object-contain drop-shadow-lg group-hover:opacity-70 transition-opacity"
                    />
                  </div>
                  <span class="text-white text-[9px] font-bold bg-black/60 px-1 rounded leading-tight">{pos.label}</span>
                </button>
              {:else}
                <div
                  class="flex flex-col items-center gap-0.5 transition-all
                    {isDragTarget ? 'scale-110' : 'opacity-60'}"
                >
                  <div
                    class="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all
                      {isDragTarget
                        ? 'border-white bg-white/20'
                        : 'border-white/40 border-dashed'}"
                  >
                    <span class="text-white/70 text-xs">{isDragTarget ? '↓' : '+'}</span>
                  </div>
                  <span class="text-white/70 text-[9px] font-bold">{pos.label}</span>
                </div>
              {/if}
            </div>
          {/each}
        </div>
        <p class="text-xs text-surface-400-500-token text-center">Drag to rearrange · Click to remove</p>
      {/if}

      <!-- Stadium -->
      <div
        class="flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer
          {stadiumPicked
            ? 'variant-soft-primary border-primary-500'
            : remaining >= STADIUM_PRICE
              ? 'border-surface-400-500-token hover:variant-soft-surface'
              : 'border-surface-400-500-token opacity-40 cursor-not-allowed'}"
        role="checkbox"
        aria-checked={stadiumPicked}
        tabindex="0"
        on:click={() => { if (stadiumPicked || remaining >= STADIUM_PRICE) stadiumPicked = !stadiumPicked; }}
        on:keydown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (stadiumPicked || remaining >= STADIUM_PRICE) stadiumPicked = !stadiumPicked; } }}
      >
        <div>
          <div class="text-sm font-medium">Stadium Choice</div>
          <div class="text-xs text-surface-400-500-token">optional add-on</div>
        </div>
        <div class="flex items-center gap-2">
          <span class="badge variant-filled-primary text-xs font-mono">$3</span>
          <div class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0
            {stadiumPicked ? 'bg-primary-500 border-primary-500' : 'border-surface-400'}">
            {#if stadiumPicked}<span class="text-white text-xs">✓</span>{/if}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          class="btn btn-sm variant-filled-primary flex-1"
          on:click={shareDraft}
          disabled={filledCount === 0}
        >
          {copied ? '✓ Copied!' : 'Share Link'}
        </button>
        <button
          class="btn btn-sm variant-ghost-error flex-1"
          on:click={reset}
          disabled={filledCount === 0}
        >
          Reset
        </button>
      </div>
    </div>
  </div>

  <!-- Character Browser (right) -->
  <div class="flex-1 min-w-0">
    <div class="flex flex-wrap gap-2 mb-3 items-center">
      <h2 class="h3 mr-2">Characters</h2>
      <input
        class="input input-sm w-40"
        type="search"
        placeholder="Search..."
        bind:value={search}
      />
      <select class="select select-sm w-36 text-xs" bind:value={sortBy}>
        <option value="price-desc">$ High → Low</option>
        <option value="price-asc">$ Low → High</option>
        <option value="name">Name A–Z</option>
        <option value="tier">$ Tiers</option>
      </select>
    </div>

    {#if sortBy === 'tier'}
      <div class="flex flex-wrap gap-x-6 gap-y-4 items-start">
        {#each tiers as tier}
          {@const tierChars = filtered.filter(c => c.price === tier)}
          <div class="flex flex-col gap-1">
            <span class="badge variant-filled-primary font-mono text-xs self-start">${tier}</span>
            <div class="flex flex-wrap gap-1.5">
              {#each tierChars as char}
                {@const affordable = !rosterFull && spent + char.price <= BUDGET}
                <button
                  class="card p-1.5 flex flex-col items-center gap-0.5 text-center transition-all
                    {affordable ? 'cursor-pointer hover:scale-105 hover:variant-soft-primary' : 'cursor-not-allowed'}"
                  style={affordable ? '' : 'opacity: 0.3; filter: grayscale(1);'}
                  on:click={() => addCharacter(char.name)}
                  disabled={!affordable}
                  title={rosterFull ? 'Roster full' : !affordable ? 'Over budget' : `Add ${char.name}`}
                >
                  <img src="/images/Characters/{char.name}.png" alt={char.name} class="w-10 h-10 object-contain" />
                  <span class="text-[10px] leading-tight">{char.name}</span>
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>

    {:else}
      <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 xl:grid-cols-8 gap-2">
        {#each filtered as char}
          {@const affordable = !rosterFull && spent + char.price <= BUDGET}
          <button
            class="card p-1.5 flex flex-col items-center gap-0.5 text-center transition-all
              {affordable ? 'cursor-pointer hover:scale-105 hover:variant-soft-primary' : 'cursor-not-allowed'}"
            style={affordable ? '' : 'opacity: 0.3; filter: grayscale(1);'}
            on:click={() => addCharacter(char.name)}
            disabled={!affordable}
            title={rosterFull ? 'Roster full' : !affordable ? 'Over budget' : `Add ${char.name}`}
          >
            <img src="/images/Characters/{char.name}.png" alt={char.name} class="w-10 h-10 object-contain" />
            <span class="text-[10px] leading-tight">{char.name}</span>
            <span class="badge variant-filled-primary text-[10px] font-mono px-1">${char.price}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

</div>
