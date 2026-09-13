<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import Move from '@lucide/svelte/icons/move';
	import X from '@lucide/svelte/icons/x';
	import type { RankedCompany, RankingMetric } from '$lib/types.js';

	let {
		company,
		side,
		onDropCompany,
		onRemove
	}: {
		company: RankedCompany | null;
		side: 'left' | 'right';
		onDropCompany: (identifier: string) => void;
		onRemove: () => void;
	} = $props();

	let dragOver = $state(false);
	const categories: RankingMetric[] = ['Society', 'Knowledge', 'Health', 'Environment'];

	function amount(value: string): number {
		const parsed = Number.parseFloat(value);
		return Number.isFinite(parsed) ? parsed : 0;
	}

	function categoryNet(category: RankingMetric): string {
		if (!company || category === 'Overall') return '—';
		const totals = company.esg.category_totals[category];
		if (!totals || (!totals.cost && !totals.benefit)) return '0 ¢/$';
		const net = amount(totals.cost) + amount(totals.benefit);
		return `${net > 0 ? '+' : ''}${Number(net.toFixed(1))} ¢/$`;
	}

	function drop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		const identifier = event.dataTransfer?.getData('application/x-ranked-company');
		if (identifier) onDropCompany(identifier);
	}

	function dragOverTarget(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
		dragOver = true;
	}
</script>

<aside
	role="region"
	aria-label={`Company ${side === 'left' ? 'A' : 'B'} comparison drop area`}
	class={[
		'relative flex min-h-96 min-w-0 flex-col overflow-hidden rounded-2xl border-2 bg-card shadow-sm transition-colors',
		dragOver
			? 'border-primary ring-4 ring-primary/10'
			: company
				? 'border-border'
				: 'border-dashed border-border'
	]}
	ondragover={dragOverTarget}
	ondragleave={() => (dragOver = false)}
	ondrop={drop}
>
	{#if dragOver}
		<div
			class="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/90 text-primary backdrop-blur-sm"
		>
			<Move class="mb-3 size-8" />
			<p class="font-semibold">Drop as Company {side === 'left' ? 'A' : 'B'}</p>
		</div>
	{/if}

	{#if company}
		<div class="h-36 shrink-0 border-b bg-muted/20 p-5">
			<div class="flex items-start gap-3">
				<div class="mt-0.5 rounded-md border bg-background p-1.5 text-muted-foreground">
					<GripVertical class="size-4" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Company {side === 'left' ? 'A' : 'B'}
					</p>
					<h2 class="mt-1 text-xl leading-tight font-semibold">{company.companyName}</h2>
					<p class="mt-1 text-sm text-muted-foreground">
						{company.esg.industry || 'Industry unavailable'} · {company.esg.country_of_hq ||
							'HQ unavailable'}
					</p>
				</div>
				<Button size="icon-sm" variant="ghost" aria-label="Remove company" onclick={onRemove}>
					<X />
				</Button>
			</div>
		</div>

		<div class="min-h-0 flex-1 overflow-y-auto p-3">
			<p
				class="px-2 pt-1 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
			>
				Matched fields
			</p>

			<div class="space-y-2">
				<div class="min-h-18 rounded-xl border bg-background p-3">
					<p class="text-sm font-medium">Overall net impact</p>
					<p class="mt-1 text-lg font-semibold">
						{company.score === null ? 'N/A' : `${company.score}%`}
					</p>
				</div>

				{#each categories as category}
					{@const totals = company.esg.category_totals[category]}
					<div class="min-h-22 rounded-xl border bg-background p-3">
						<p class="text-sm font-medium">{category}</p>
						<p class="text-base font-semibold">{categoryNet(category)}</p>
						<p class="mt-1 text-xs">
							<span class="text-emerald-700">Benefit {totals?.benefit || '0'}</span>
							<span class="px-1 text-muted-foreground">·</span>
							<span class="text-rose-700">Cost {totals?.cost || '0'}</span>
						</p>
					</div>
				{/each}

				<div class="min-h-18 rounded-xl border bg-background p-3">
					<p class="text-sm font-medium">Revenue</p>
					<p class="mt-1 text-sm font-semibold">
						{company.esg.revenue || company.esg.screener_revenue_musd || 'N/A'}
					</p>
				</div>

				<div class="min-h-18 rounded-xl border bg-background p-3">
					<p class="text-sm font-medium">Employees</p>
					<p class="mt-1 text-sm font-semibold">{company.esg.employee_count || 'N/A'}</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex h-full min-h-96 flex-col items-center justify-center px-8 text-center">
			<div class="mb-4 rounded-2xl bg-muted/40 p-5 text-muted-foreground">
				<Move class="size-8" />
			</div>
			<h2 class="text-lg font-semibold">Company {side === 'left' ? 'A' : 'B'}</h2>
			<p class="mt-2 max-w-52 text-sm leading-6 text-muted-foreground">
				Drop a company anywhere in this panel, or use its Compare button.
			</p>
		</div>
	{/if}
</aside>
