# ManicurePlaces Component

A comprehensive React component that displays manicure places in a city using the Google Places API.

## Features

- 🗺️ **Interactive Map**: Google Maps integration with custom markers
- 🔍 **Search & Filter**: Search by service type and location
- 📱 **Responsive Design**: Works on all device sizes
- ⭐ **Ratings & Reviews**: Display Google ratings and review counts
- 📞 **Contact Information**: Phone numbers and websites
- 🕒 **Opening Hours**: Real-time open/closed status
- 🏙️ **City Selection**: Choose from popular Polish cities
- 🎨 **Beautiful UI**: Modern design with smooth animations

## Installation

Make sure you have the required dependencies:

```bash
npm install @react-google-maps/api react-icons
```

## Environment Variables

Add your Google Maps API key to your environment variables:

```env
NEXT_PUBLIC_FIREBASE_MAP_KEY=your_google_maps_api_key_here
```

## Usage

### Basic Usage

```jsx
import ManicurePlaces from "@/components/ManicurePlaces";

export default function MyPage() {
  return (
    <div>
      <ManicurePlaces initialCityName="Warszawa" />
    </div>
  );
}
```

### Advanced Usage

```jsx
import ManicurePlaces from "@/components/ManicurePlaces";

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Znajdź Salony Manicure</h1>

        <ManicurePlaces initialCityName="Kraków" />
      </div>
    </div>
  );
}
```

## Props

| Prop              | Type   | Default    | Description                    |
| ----------------- | ------ | ---------- | ------------------------------ |
| `initialCityName` | string | "Warszawa" | The initial city to search for |

## Features

### 1. City Selection

- Dropdown with popular Polish cities
- Search functionality to find specific cities
- Automatic map centering when city changes

### 2. Service Types

- **Manicure**: Basic manicure services
- **Pedicure**: Pedicure services
- **Nail Art**: Artistic nail design
- **Gel Nails**: Gel nail services

### 3. Interactive Map

- Google Maps integration
- Custom pink markers for manicure places
- Info windows with place details
- Click to select places

### 4. Places List

- Scrollable list of found places
- Place photos (when available)
- Ratings with star display
- Contact information
- Opening hours status

### 5. Search & Filters

- Search by place name or address
- Filter by service type
- Additional filters (rating, status, sorting)
- Real-time search results

### 6. Place Details

- Detailed view of selected place
- Large photo display
- Complete contact information
- Rating and review count
- Opening hours

## API Integration

The component uses the Google Places API to fetch data. It includes:

- **Text Search**: Searches for beauty salons in the specified city
- **Place Details**: Fetches detailed information about each place
- **Photos**: Displays place photos when available
- **Ratings**: Shows Google ratings and review counts

## Styling

The component uses Tailwind CSS classes and includes:

- Responsive grid layout
- Hover effects and transitions
- Loading states with spinners
- Error handling with user-friendly messages
- Consistent color scheme (pink/purple theme)

## Error Handling

- Network error handling
- API error messages
- Loading states
- Empty state when no places found

## Performance

- Debounced search input
- Efficient re-rendering
- Optimized API calls
- Lazy loading of place details

## Browser Support

- Modern browsers with ES6+ support
- Google Maps API compatibility
- Responsive design for mobile devices

## Customization

You can customize the component by modifying:

- Color scheme in the CSS classes
- Search terms in the `searchTerms` object
- Map options in `mapOptions`
- Popular cities list in `CitySelector`

## Example Output

The component displays:

- Interactive map with place markers
- List of manicure salons with photos and ratings
- Detailed view of selected places
- Search and filter controls
- City selection dropdown

## Dependencies

- `@react-google-maps/api`: Google Maps React wrapper
- `react-icons`: Icon library
- `react`: React framework
- Tailwind CSS: Styling framework

## License

This component is part of the Naily project and follows the same license terms.
