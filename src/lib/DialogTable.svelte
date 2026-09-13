<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { RankedCompany } from '$lib/types.js';

	let { stock }: { stock: RankedCompany } = $props();

	function shown(value: string | undefined): string {
		return value?.trim() || 'Not available';
	}

	function shownImpact(value: string | undefined): string {
		return value?.trim() || '0';
	}

	function impactClass(value: string): string {
		if (value.startsWith('+')) return 'text-emerald-700 dark:text-emerald-400';
		if (value.startsWith('-')) return 'text-rose-700 dark:text-rose-400';
		return 'text-muted-foreground';
	}

	function formattedDate(value: string): string {
		if (!value) return 'Not available';
		const date = new Date(value);
		return Number.isNaN(date.getTime())
			? value
			: date.toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				});
	}

	function impactValue(value: string): number {
		const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ''));
		return Number.isFinite(parsed) ? Math.abs(parsed) : 0;
	}

	let categories = $derived(Object.entries(stock.esg.category_totals));
	let categoryMaximum = $derived(
		Math.max(
			1,
			...categories.flatMap(([, total]) => [impactValue(total.cost), impactValue(total.benefit)])
		)
	);
	let selectedCategory = $state('');
	let selectedMetrics = $derived(
		stock.esg.metrics.filter((metric) => metric.category === selectedCategory)
	);
	let metricMaximum = $derived(
		Math.max(
			1,
			...selectedMetrics.flatMap((metric) => [
				impactValue(metric.cost),
				impactValue(metric.benefit)
			])
		)
	);

	function barWidth(value: string, maximum: number): string {
		return `${(impactValue(value) / maximum) * 100}%`;
	}
</script>

<div>
	<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
		<div class="rounded-lg border p-3">
			<p class="text-xs tracking-wide text-muted-foreground uppercase">Net impact ratio</p>
			<p class={`mt-1 text-2xl font-semibold ${impactClass(stock.esg.net_impact_ratio)}`}>
				{shown(stock.esg.net_impact_ratio)}
			</p>
		</div>
		<div class="rounded-lg border p-3">
			<p class="text-xs tracking-wide text-muted-foreground uppercase">Global rank</p>
			<p class="mt-1 text-2xl font-semibold">
				Top {shown(stock.esg.rank_top_percent)}
			</p>
		</div>
		<div class="rounded-lg border p-3">
			<p class="text-xs tracking-wide text-muted-foreground uppercase">Revenue</p>
			<p class="mt-1 font-semibold">{shown(stock.esg.revenue)}</p>
		</div>
		<div class="rounded-lg border p-3">
			<p class="text-xs tracking-wide text-muted-foreground uppercase">Employees</p>
			<p class="mt-1 font-semibold">{shown(stock.esg.employee_count)}</p>
		</div>
	</div>

	<section class="mt-6">
		<h3 class="mb-3 text-lg font-semibold">Company overview</h3>
		<dl class="grid gap-x-6 gap-y-3 rounded-lg border p-4 sm:grid-cols-2">
			<div>
				<dt class="text-xs text-muted-foreground">Industry</dt>
				<dd>{shown(stock.esg.industry)}</dd>
			</div>
			<div>
				<dt class="text-xs text-muted-foreground">Country of headquarters</dt>
				<dd>{shown(stock.esg.country_of_hq)}</dd>
			</div>
			<div>
				<dt class="text-xs text-muted-foreground">Companies with a lower ratio</dt>
				<dd>
					{shown(stock.esg.benchmark_percent_lower)}{stock.esg.benchmark_percent_lower ? '%' : ''}
				</dd>
			</div>
			<div>
				<dt class="text-xs text-muted-foreground">Model release</dt>
				<dd>{shown(stock.esg.model_release)}</dd>
			</div>
		</dl>
	</section>

	<section class="mt-6">
		<div class="mb-3 flex flex-wrap items-end justify-between gap-2">
			<div>
				<h3 class="text-lg font-semibold">Impact by category</h3>
				<p class="text-sm text-muted-foreground">
					Select a category to expand its subdivisions; select it again to collapse.
				</p>
			</div>
			<div class="flex gap-4 text-xs" aria-label="Chart legend">
				<span class="flex items-center gap-1.5"
					><span class="h-2.5 w-2.5 bg-rose-500"></span>Cost</span
				>
				<span class="flex items-center gap-1.5"
					><span class="h-2.5 w-2.5 bg-emerald-500"></span>Benefit</span
				>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg border">
			<div
				class="grid grid-cols-[7rem_1fr] items-center gap-3 border-b bg-muted/40 px-4 py-2 text-xs font-medium sm:grid-cols-[9rem_1fr]"
			>
				<span>Category</span>
				<div class="grid grid-cols-2">
					<span class="pr-3 text-right text-rose-700 dark:text-rose-400">Cost</span>
					<span class="pl-3 text-emerald-700 dark:text-emerald-400">Benefit</span>
				</div>
			</div>

			{#each categories as [category, total]}
				<button
					type="button"
					class={`grid w-full grid-cols-[7rem_1fr] items-center gap-3 border-b px-4 py-3 text-left transition-colors sm:grid-cols-[9rem_1fr] ${selectedCategory === category ? 'bg-primary/5 ring-1 ring-primary/30 ring-inset' : 'hover:bg-muted/50'}`}
					aria-pressed={selectedCategory === category}
					aria-expanded={selectedCategory === category}
					onclick={() => (selectedCategory = selectedCategory === category ? '' : category)}
				>
					<span class="flex items-center justify-between gap-2 font-medium">
						{category}
						<ChevronRight
							class={`size-4 shrink-0 text-muted-foreground transition-transform ${selectedCategory === category ? 'rotate-90' : ''}`}
						/>
					</span>
					<div>
						<div class="grid h-6 grid-cols-2" aria-hidden="true">
							<div class="flex items-center justify-end border-r border-foreground/30">
								<div
									class="h-4 bg-rose-500"
									style:width={barWidth(total.cost, categoryMaximum)}
								></div>
							</div>
							<div class="flex items-center">
								<div
									class="h-4 bg-emerald-500"
									style:width={barWidth(total.benefit, categoryMaximum)}
								></div>
							</div>
						</div>
						<div class="grid grid-cols-2 text-xs">
							<span class="pr-3 text-right font-medium text-rose-700 dark:text-rose-400"
								>{shownImpact(total.cost)}</span
							>
							<span class="pl-3 font-medium text-emerald-700 dark:text-emerald-400"
								>{shownImpact(total.benefit)}</span
							>
						</div>
					</div>
				</button>

				{#if selectedCategory === category}
					<div class="border-b bg-muted/20 px-4 py-3">
						<div class="space-y-3">
							{#each selectedMetrics as metric}
								<div class="grid gap-1 sm:grid-cols-[12rem_1fr] sm:items-center sm:gap-4">
									<span class="text-sm font-medium">{metric.metric}</span>
									<div>
										<div class="grid h-5 grid-cols-2" aria-hidden="true">
											<div class="flex items-center justify-end border-r border-foreground/30">
												<div
													class="h-3 bg-rose-500"
													style:width={barWidth(metric.cost, metricMaximum)}
												></div>
											</div>
											<div class="flex items-center">
												<div
													class="h-3 bg-emerald-500"
													style:width={barWidth(metric.benefit, metricMaximum)}
												></div>
											</div>
										</div>
										<div class="grid grid-cols-2 text-xs">
											<span class="pr-3 text-right text-rose-700 dark:text-rose-400"
												>{shownImpact(metric.cost)}</span
											>
											<span class="pl-3 text-emerald-700 dark:text-emerald-400"
												>{shownImpact(metric.benefit)}</span
											>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</div>
		<p class="mt-2 text-xs text-muted-foreground">
			Values are cents per dollar of revenue. Bar lengths share the same scale across all four
			categories.
		</p>
	</section>

	<section class="mt-6 grid gap-4 md:grid-cols-2">
		<article
			class="rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30"
		>
			<h3 class="mb-2 font-semibold text-rose-800 dark:text-rose-300">Top negative impacts</h3>
			<p class="text-sm leading-6">
				{shown(stock.esg.top_negative_impact_explanation)}
			</p>
		</article>
		<article
			class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30"
		>
			<h3 class="mb-2 font-semibold text-emerald-800 dark:text-emerald-300">
				Top positive impacts
			</h3>
			<p class="text-sm leading-6">
				{shown(stock.esg.top_positive_impact_explanation)}
			</p>
		</article>
	</section>

	<footer
		class="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t pt-4 text-xs text-muted-foreground"
	>
		<div class="flex flex-wrap items-center gap-2">
			<span>Source: {shown(stock.esg.source_index)}</span>
			<span aria-hidden="true">·</span>
			<a class="underline" href={stock.esg.source_url} target="_blank" rel="noreferrer"
				>Source dataset</a
			>
		</div>
		<div class="flex flex-wrap items-center justify-end gap-2 text-right">
			<span>Scraped {formattedDate(stock.esg.scraped_at_utc)}</span>
			<span aria-hidden="true">·</span>
			<a class="underline" href={stock.esg.upright_url} target="_blank" rel="noreferrer"
				>Upright profile</a
			>
		</div>
	</footer>
</div>
