type SeedUser = {
	id: number;
	name: string;
	email: string;
	age: number;
	createdAt: Date;
	updatedAt: Date;
};

export const mockUsers: SeedUser[] = [
	{
		id: 1,
		name: "Alice",
		email: "alice@example.com",
		age: 42,
		createdAt: new Date("2026-07-30T00:00:00.000Z"),
		updatedAt: new Date("2026-08-04T00:00:00.000Z"),
	},
	{
		id: 2,
		name: "Robert",
		email: "robert@example.com",
		age: 21,
		createdAt: new Date("2026-07-30T00:00:00.000Z"),
		updatedAt: new Date("2026-08-04T00:00:00.000Z"),
	},
];
