import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const routes = [
	{
		icon: "home",
		path: "/",
		name: "Index",
		component: () => import("../components/Index")
	},
	{
		icon: "people",
		path: "/users",
		name: "Users",
		component: () => import("../components/users/Users")
	},
	{
		icon: "equalizer",
		path: "/news",
		name: "News",
		component: () => import("../components/news/News")
	},
	{
		icon: "images",
		path: "/slider",
		name: "Slider",
		component: () => import("../components/slider/Slider.vue")
	},
	{
		icon: "video_library",
		path: "/animes",
		name: "Animes",
		submenus: [
			{
				icon: "list",
				path: "/",
				name: "List",
				component: import("../components/animes/List")
			},
			{
				icon: "add",
				path: "/add",
				name: "Add",
				component: import("../components/animes/Add")
			},
			{
				hide: true,
				icon: "edit",
				path: "/edit/:id",
				name: "Edit",
				props: true,
				component: import("../components/animes/Edit")
			}
		]
	},
	{
		icon: "label",
		path: "/tags",
		name: "Tags",
		component: import("../components/tags/Tags")
	},
	{
		icon: "people",
		path: "/authors",
		name: "Authors",
		component: import("../components/authors/Authors")
	}
];

const router = new Router({
	routes: convert(routes),
	mode: "history"
});

function convert(routes) {
	let newRoutes = [];
	routes.forEach(v => {
		v.meta = {};
		if (v.submenus) {
			v.submenus.forEach(s => {
				s.path = v.path + s.path;
				s.meta = {
					parent: v.name,
					submenus: v.submenus.filter(s => !s.hide).map(s => s.name)
				};
				newRoutes.push(s);
			});
		} else newRoutes.push(v);
	});

	return newRoutes;
}

export default router;
