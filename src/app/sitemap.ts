import { publicUrl } from "@/env.mjs";
import StoreConfig from "@/store.config";
import * as Commerce from "commerce-kit";
import type { MetadataRoute } from "next";

type Item = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products = await Commerce.productBrowse({ first: 100 });

	// Filter out products that do not have a valid slug before mapping
	const productUrls = products
		.filter(
			(product) =>
				typeof product.metadata?.slug === "string" && product.metadata.slug.length > 0,
		)
		.map(
			(product) =>
				({
					url: `${publicUrl}/product/${product.metadata.slug}`,
					lastModified: new Date(product.updated * 1000),
					changeFrequency: "daily",
					priority: 0.8,
				}) satisfies Item,
		);

	// Filter out categories that do not have a valid slug before mapping
	const categoryUrls = StoreConfig.categories
		.filter((category) => typeof category.slug === "string" && category.slug.length > 0)
		.map(
			(category) =>
				({
					url: `${publicUrl}/category/${category.slug}`,
					lastModified: new Date(),
					changeFrequency: "daily",
					priority: 0.5,
				}) satisfies Item,
		);

	return [
		{
			url: publicUrl,
			lastModified: new Date(),
			changeFrequency: "always",
			priority: 1,
		},
		...productUrls,
		...categoryUrls,
	];
}
