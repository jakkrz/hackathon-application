export interface ImpactAmount {
	cost: string;
	benefit: string;
	unit: string;
}

export interface ImpactMetric extends ImpactAmount {
	category: string;
	metric: string;
}

export interface UprightCompany {
	company: string;
	industry: string;
	screener_revenue_musd: string;
	largest_cost: string;
	largest_benefit: string;
	screener_net_impact_ratio: string;
	screener_percentile: string;
	upright_url: string;
	country_of_hq: string;
	revenue: string;
	employee_count: string;
	net_impact_ratio: string;
	rank_top_percent: string;
	benchmark_percent_lower: string;
	model_release: string;
	top_negative_impact_explanation: string;
	top_positive_impact_explanation: string;
	category_totals: Record<string, ImpactAmount>;
	metrics: ImpactMetric[];
	scraped_at_utc: string;
	source_index: string;
	source_url: string;
}

export interface RankedCompany {
	companyName: string;
	stockName: string;
	score: number | null;
	esg: UprightCompany;
}

export type RankingMetric = 'Overall' | 'Society' | 'Knowledge' | 'Health' | 'Environment';
