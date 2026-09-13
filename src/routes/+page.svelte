<script lang="ts">
	import Ranking from '$lib/Ranking.svelte';
	import ComparisonPanel from '$lib/ComparisonPanel.svelte';
	import uprightCompanies from '../upright_metrics/upright_final_esg.json';
	import type { RankedCompany, UprightCompany } from '$lib/types.js';

	function percentage(value: string): number | null {
		const parsed = Number.parseFloat(value.replace('%', ''));
		return Number.isFinite(parsed) ? parsed : null;
	}

	const data: RankedCompany[] = (uprightCompanies as UprightCompany[])
		.map((esg) => ({
			companyName: esg.company,
			stockName: esg.company,
			score: percentage(esg.net_impact_ratio || esg.screener_net_impact_ratio),
			esg
		}))
		.sort((left, right) => (right.score ?? -Infinity) - (left.score ?? -Infinity));

	let leftCompany = $state<RankedCompany | null>(null);
	let rightCompany = $state<RankedCompany | null>(null);
	let comparisonList = $derived(
		[leftCompany, rightCompany].filter((company): company is RankedCompany => company !== null)
	);

	function addToComparison(company: RankedCompany) {
		if (comparisonList.some((item) => item.companyName === company.companyName)) return;
		if (!leftCompany) leftCompany = company;
		else if (!rightCompany) rightCompany = company;
	}

	function removeFromComparison(company: RankedCompany) {
		if (leftCompany?.companyName === company.companyName) leftCompany = null;
		if (rightCompany?.companyName === company.companyName) rightCompany = null;
	}

	function dropCompany(side: 'left' | 'right', identifier: string) {
		const company = data.find((item) => item.esg.upright_url === identifier);
		if (!company) return;

		if (side === 'left') {
			if (rightCompany?.companyName === company.companyName) rightCompany = null;
			leftCompany = company;
		} else {
			if (leftCompany?.companyName === company.companyName) leftCompany = null;
			rightCompany = company;
		}
	}
</script>

<main
	class="mx-auto grid min-h-screen max-w-[112rem] grid-cols-1 gap-4 p-4 xl:h-screen xl:min-h-0 xl:grid-cols-[minmax(34rem,42rem)_minmax(42rem,1fr)]"
>
	<Ranking {data} {addToComparison} {removeFromComparison} {comparisonList} />
	<section class="grid min-h-0 grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Company comparison">
		<ComparisonPanel
			company={leftCompany}
			side="left"
			onDropCompany={(identifier) => dropCompany('left', identifier)}
			onRemove={() => (leftCompany = null)}
		/>
		<ComparisonPanel
			company={rightCompany}
			side="right"
			onDropCompany={(identifier) => dropCompany('right', identifier)}
			onRemove={() => (rightCompany = null)}
		/>
	</section>
</main>
