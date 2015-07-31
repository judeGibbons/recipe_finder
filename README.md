#Recipe finder

The form queries the [Guardian content API](http://open-platform.theguardian.com/access/) 
for recipe articles with certain keywords. The word 'recipe' is always included 
by default: other words can be included or excluded.

Certain defaults have been chosen and hard-coded into the url string: the search 
is restricted to the Life and Style section, the number of results per page is set 
to 20, and the sort order is newest article first.

The app currently doesn't support IE9 and below.

The page is live [here](http://gimaju.net/recipes/).

Still to do: 

* look into local storage in order to persist the page data when opening a new
page in the same tab (I am currently opening the retrieved links 
in a new tab);

* check submitted strings for extraneous characters: I think the API looks after 
the encoding, but extra spaces cause the search to use OR rather than AND;

* add a loading spinner for when the page takes a while to retrieve results, and 
display an error message if nothing loads;

* create radio buttons to allow the search fields to be set to search on 'all 
words' (which is what it is currently), 'any word' or 'exact phrase';

* add a logo and a default thumbnail image for when the article doesn't
provide one (I am currently using a placeholder image).