db = db.getSiblingDB('la_wiki_db');  // Switch to the 'school_db' database

// Sample data
const Wiki = [
  { _id: 1, name: "Star Wars", description: "Star Wars wiki. Characters, Planets, Ships and many more" },
  { _id: 2, name: "Naruto", description: "Naruto world!!!" }
];

const Article= [
	{_id: 1, Wiki_id: 1, Author: "Pepe", Date: "2012-04-23T18:25:43.511Z", Title: "Chewbacca", Body: "he is a cool guy"},
	{_id: 2, Wiki_id: 1, Author: "Carlo", Date: "2024-02-02T13:11:45.000Z", Title: "Admiral Ackbar", Body: "It's a Trap!"},
	{_id: 3, Wiki_id: 2, Author: "Clara", Date: "2024-10-09T08:13:51.121Z", Title: "Naruto Uzumaki", Body:"Some guy with funny hairstyle"},
	{_id: 4, Wiki_id: 1, Author: "Pepe", Date: "2023-04-23T18:25:43.511Z", Title: "X-Wing", Body: "Orbital fighter jet"},
	{_id: 5, Wiki_id: 2, Author: "Maria", Date: "2024-10-08T01:00:12.000Z", Title: "Hiroshima", Body: "The place where something happend."}
];

// Insert classrooms
db.wiki.insertMany(Wiki);

// Insert pupils
db.article.insertMany(Article);

print("Database initialized with Articles and Wikis.");
