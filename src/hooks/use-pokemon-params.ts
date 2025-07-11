"use client";

import {
	type Option,
	classFilterOptionSchema,
	formFilterOptionSchema,
	pokemonTypeFilterOptionSchema,
	regionFilterOptionSchema,
} from "@/lib/control-panel/schema";
import {
	validateMultiParams,
	validateSortOption,
} from "@/lib/control-panel/validator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function usePokemonParams() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const options = useMemo(() => {
		return {
			class: validateMultiParams(
				searchParams,
				"class",
				classFilterOptionSchema,
			),
			form: validateMultiParams(searchParams, "form", formFilterOptionSchema),
			implementedStatus:
				(searchParams.get("implementedStatus") as
					| "all"
					| "implemented"
					| "not-implemented") || "all",
			shinyImplementedStatus:
				(searchParams.get("shinyImplementedStatus") as
					| "all"
					| "shiny-implemented"
					| "shiny-not-implemented") || "all",
			pokemonType: validateMultiParams(
				searchParams,
				"pokemonType",
				pokemonTypeFilterOptionSchema,
			),
			region: validateMultiParams(
				searchParams,
				"region",
				regionFilterOptionSchema,
			),
			sort: validateSortOption(searchParams.get("sort")),
		};
	}, [searchParams]);

	const setOption = useCallback(
		(options: Option) => {
			const params = new URLSearchParams(searchParams);
			// フィルター
			for (const key of ["class", "form", "pokemonType", "region"] as const) {
				const value = options[key];
				if (value.length === 0 || value.includes("all")) {
					params.delete(key);
				} else {
					params.set(key, value.join(","));
				}
			}
			params.set("implementedStatus", options.implementedStatus);
			params.set("shinyImplementedStatus", options.shinyImplementedStatus);
			if (options.sort && options.sort !== "pokedex-number-asc") {
				params.set("sort", options.sort);
			} else {
				params.delete("sort");
			}
			router.push(`${pathname}?${params.toString()}`);
		},
		[router, pathname, searchParams],
	);

	// リセット
	const clearOption = useCallback(() => {
		router.push(pathname);
	}, [router, pathname]);

	return {
		options,
		setOption,
		clearOption,
	};
}
