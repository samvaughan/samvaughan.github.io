``---
layout: post
title:  "Learning Pandas- plotting flight paths"
date:   2017-08-30 20:32:11 +0000
categories: code
---

I'd like to learn how to use the `pandas` package [](http://pandas.pydata.org/) properly. It's really useful for reading in large files, dealing with tabular data and sorting/cleaning datasets, and isn't something I often use in my day-to-day PhD work. So, to dive right in, I thought I'd dive right in and download an interesting dataset from [Kaggle](https://www.kaggle.com/). Kaggle hosts many raw datasets, with data covering everything from European football to different plan species and even transcripts of Twitter, South Park episodes and UN speeches. If you haven't heard of it before I definitely recommnend having a look!

I chose the data on airline routes and airports, from [here](https://www.kaggle.com/open-flights/flight-route-database) and [here](https://www.kaggle.com/open-flights/airports-train-stations-and-ferry-terminals), thinking that I'd join these two datasets together and plot a map of flight routes around the world. 

The airports dataset has the longitude and latitude of ~8000 airports around the world. Each airport also has a unique id, which is referenced in the flight routes data. I'd need to join the tables together, so instead of columns named `"source airport id"`, we'd have `"source airport longitude"` and `"source airport latitude"` instead. This is easily done with pandas, but it took me a little while to get my head around how it works. 

First we load everything in:

```python
#import things
import numpy as np                                            
import pandas as pd 

#Column names, since this csv file doesn't seem to have a header
names = ['id','Name' ,'City' ,'Country','Airport ID','IATA' ,'lat', 'lon' ,'Altitude','Timezone' ,'DST' ,'Tz' ,'Type','Source'

#Read in the airport data sets
stations = pd.read_csv('airports_extended.csv', names = names)
#only choose airports
airports=stations[stations['Type']=='airport']

#get the flight routes
#No need for column names here, as we have a header already
routes=pd.read_csv('routes.csv')
```

Now we make sure that the id columns in both these series are actualy numerical data. I was tearing my hair out trying to match one against the other before realising that one id column was all `strings` and the other all `ints`!

```python
#Make series of just the ids, and convert them to floats
tmp_sources=pd.DataFrame(pd.to_numeric(routes[' source airport id'], errors='coerce'))
tmp_dests=pd.DataFrame(pd.to_numeric(routes[' destination airport id'], errors='coerce'))
```

Setting `errors='coerce'` makes sure that any incorrect values are set to Nans, rather than throwing an error.

```python
#Get just the longitude and latitude columns
locations=airports[['id', 'lon', 'lat']] 

#and merge with the (temporary) route starts and stops  
sources=pd.merge(tmp_sources, locations, left_on=' source airport id', right_on='id')
destinations=pd.merge(tmp_dests, locations, left_on=' destination airport id', right_on='id')

#join these together, to get a table with lons and lats for the airport sources and destinations 
final=sources.join(destinations, lsuffix='_source', rsuffix='_dest') 
```
The merge and join functions here are the really useful parts of pandas. The two accomplish very similar things, but are subtley different- and I can't say I'm entirely sure when one is more approriate than the other! Something on the list of things to learn. Now our new dataframe `Final` has columns like `lat_source`, `lon_source`, `lon_dest` and `lat_dest`, and the next thing to do is to plot them all on a map.

I did this using the useful package [Cartopy](http://scitools.org.uk/cartopy/). You can simply load up a matplotlib axis with the appropriate map projection and plot things in longitude and latitude on there!

```python
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
from matplotlib import collections  as mc

ax = plt.axes(projection=ccrs.PlateCarree())

#Add coastlines with high resolution
ax.coastlines(resolution='10m')
#Add a map image
ax.stock_img()
```

To plot my actual flight routes, I'd need to use a `LineCollection`. Going through and plotting the ~68000 routes one by one in a for loop would take forever!

```python
#Get just the columns we want from our final dataframe
lines=final[['lon_source', 'lat_source', 'lon_dest', 'lat_dest']].values

#Reshape them into (x_0, y_) (x_1, y_1) pairs
lines=lines.reshape(-1, 2, 2)

#Make a path collection with the correct geodesic transformation
lc = mc.LineCollection(lines, linewidths=0.1, colors='g', transform=ccrs.Geodetic()) 

#Plot!
ax.add_collection(lc)  

plt.show()
```
Here, the "Geodetic" transformation ensures that our lines between two coordinates follow the curvature of the Earth (as real flight plans do). The final plot looks like this:

![](https://raw.githubusercontent.com/samvaughan/samvaughan.github.io/master/_posts/Images/flight_paths.jpg)

Which looks okay! I'd like to go back and play with things a bit- like use a nicer map image, and maybe colour the flights based on length or duration somehow. It also takes around a minute to run on my laptop, with the geodesic transformation for the line collection taking up most of that time. So maybe there's a more efficient way?



