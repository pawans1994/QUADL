SMART (Skill Model mining with Automated detection of Resemblance among Texts)

The goal of this project is to extract a Skill Model from Massive Open Online Courses (MOOC) and to map a skill with each assessment item (question) as well as a text item (paragraph) in the course. Nowadays, there are a lot of MOOCs available for learners to consider and learn from. Therefore, it becomes very important to let the machines themselves learn important skills associated with each assessment item, without any supervision from the tutor. This application can be used to provide automatic feedback and hints to the learner of the course. Hence, propose a new system which creates associations between assessment items and workbook contents (topics).

Website
Technical Details
Parsing XML files: First, the xml files from the data is parsed and converted into .txt files. BeautifulSoup library has been used for this purpose.

Lower casing and removing punctuations: All the words in the text files is converted into lower case so same words are not treated differently because of their casing.

Term Frequency: Term Frequency is calculated for all the words within each text item as well as assessment item.

Cosine Similarity: Cosine Similarity is then calculated for each text item and an assessment item. The pairings with maximum cosine similarity means they are most associated with each other.

K Means Clustering: Instead of using each text item separately, we can also cluster multiple text items using K means clustering. These clusters are hypothesised to be the skills associated with the online course.

Keyword Extraction using TextRank: Keyword Extraction is performed using TextRank. These keywords are hypothesised to represent the name of the skill (cluster) that they represent.

Merging Clusters based on Common Keywords: To find the optimal number of skills taught in the course, skills (clusters) are merged together based on the common keywords extracted from each. So, if two clusters have the same two keywords, then they are merged together.

Data
To validate our system, we used data from Introduction to Biology by Open Learning Initiative(OLI). According to their website (insert link here), "The Open Learning Initiative (OLI) is a grant-funded group at Carnegie Mellon University, offering innovative online courses to anyone who wants to learn or teach. Our aim is to create high-quality courses and contribute original research to improve learning and transform higher education." Anyone can take this course on oli.cmu.edu for free without registration. Since this database is a private repository, we cannot share the data on Github.

Python Libraries
BeautifulSoup (Parsing XML Files)
pip install beautifulsoup4
lxml (Processing XML Files)
pip install lxml
Sklearn (TF-IDF Vectorizer, K Means Clustering)
pip install -U scikit-learn
summa (Keyword Extraction using TextRank)
pip install summa
Networkx (Building graph for TextRank)
pip install networkx
Pattern (Part-of-speech Tagging for Keyword Extraction)
pip install pattern
