# Google map integration guide.

## Table of Content.
<div style="font-size:24px;font-weight:bold">
    <ol>
        <li>Price.</li>
        <li>Ease of use.</li>
        <li>Integration examples
            <ul style="font-size:18px">
                <li>FrontEnd</li>
                <li>BackEnd (With Python)</li>
        </li>
    </ol>
</div>
________________________________________

## 1. Price 
Google offers 200 USD per month. It requires payment details but it promises never charge you money unless you separately gives that permission to do so.

## 2. Ease of use.
The tool is well documented and offest tons of examples all arount internet and inside Google cloud website itself.

## 3. Integration examples
###  FrontEnd

To use google map in the frontend you have to inject parametrized snipped into your html document 

```html
<iframe
    width="450"
    height="250"
    frameborder="0" style="border:0"
    referrerpolicy="no-referrer-when-downgrade"
    src="https://www.google.com/maps/embed/v1/MAP_MODE?key=YOUR_API_KEY&PARAMETERS"
    allowfullscreen>
</iframe>
```
Where user must provide parameters MAP_MODE, in our case it would be `place` in most of the cases, YOUR_API_KEY, that is provided by Google at the moment of registrations. And PARAMETERS, that specifies the location of the object we would like to display.

For more details visit [Documentation Page](https://developers.google.com/maps/documentation/embed/embedding-map)



### BackEnd (With Python)
Python requires to install Google map dependecy `googlemaps` using pip install command. All documentation and manuals can be found in the corresponding GitHub repository [google-map-services-python](https://github.com/googlemaps/google-maps-services-python)



