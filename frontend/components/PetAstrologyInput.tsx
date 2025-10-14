import React, { useState } from 'react';
import { PetBirthData } from '../types/astrology';
import './PetAstrologyInput.css';

interface PetAstrologyInputProps {
  onSubmit: (petData: PetBirthData) => void;
  loading?: boolean;
}

/**
 * Pet Astrology Input Component
 * Collects pet birth information for astrology analysis
 */
const PetAstrologyInput: React.FC<PetAstrologyInputProps> = ({
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<PetBirthData>({
    name: '',
    species: '',
    breed: '',
    birthDate: new Date(),
    birthTime: '',
    birthLocation: {
      latitude: 28.6139, // Default to Delhi
      longitude: 77.2090
    },
    ownerName: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PetBirthData, string>>>({});

  // Predefined options
  const speciesOptions = [
    { value: 'dog', label: 'Dog', icon: '🐕' },
    { value: 'cat', label: 'Cat', icon: '🐱' },
    { value: 'bird', label: 'Bird', icon: '🐦' },
    { value: 'horse', label: 'Horse', icon: '🐎' },
    { value: 'rabbit', label: 'Rabbit', icon: '🐰' },
    { value: 'fish', label: 'Fish', icon: '🐠' },
    { value: 'reptile', label: 'Reptile', icon: '🦎' },
    { value: 'other', label: 'Other', icon: '🐾' }
  ];

  const breedOptions: Record<string, string[]> = {
    dog: [
      'Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'Bulldog',
      'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund',
      'Siberian Husky', 'Great Dane', 'Chihuahua', 'Border Collie', 'Mixed Breed'
    ],
    cat: [
      'Persian', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Siamese',
      'American Shorthair', 'Sphynx', 'Bengal', 'Russian Blue', 'Mixed Breed'
    ],
    bird: [
      'Parrot', 'Canary', 'Cockatiel', 'Budgerigar', 'Finch',
      'Lovebird', 'African Grey', 'Cockatoo', 'Macaw', 'Other'
    ],
    horse: [
      'Arabian', 'Thoroughbred', 'Quarter Horse', 'Appaloosa', 'Paint',
      'Warmblood', 'Draft Horse', 'Pony', 'Mustang', 'Other'
    ],
    rabbit: [
      'Dutch', 'Mini Lop', 'Netherland Dwarf', 'Rex', 'Lionhead',
      'Holland Lop', 'Flemish Giant', 'Angora', 'Mixed Breed'
    ],
    fish: [
      'Goldfish', 'Betta', 'Guppy', 'Tetra', 'Angelfish',
      'Cichlid', 'Koi', 'Other Freshwater', 'Other Saltwater'
    ],
    reptile: [
      'Bearded Dragon', 'Leopard Gecko', 'Ball Python', 'Corn Snake',
      'Turtle', 'Tortoise', 'Iguana', 'Chameleon', 'Other'
    ],
    other: ['Custom Breed']
  };

  const handleInputChange = (field: keyof PetBirthData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    // Reset breed when species changes
    if (field === 'species' && value !== formData.species) {
      setFormData(prev => ({
        ...prev,
        breed: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PetBirthData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pet name is required';
    }

    if (!formData.species) {
      newErrors.species = 'Species is required';
    }

    if (!formData.breed && formData.species && breedOptions[formData.species]?.length > 0) {
      newErrors.breed = 'Breed is required';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.birthDate);
      if (birthDate > today) {
        newErrors.birthDate = 'Birth date cannot be in the future';
      }
      const minDate = new Date('2000-01-01');
      if (birthDate < minDate) {
        newErrors.birthDate = 'Birth date seems too old';
      }
    }

    if (!formData.birthLocation?.latitude || !formData.birthLocation?.longitude) {
      newErrors.birthLocation = 'Birth location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getLocationFromCoords = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        handleInputChange('birthLocation', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      } catch (error) {
        console.error('Error getting location:', error);
        // Could show a user-friendly message here
      }
    }
  };

  return (
    <div className="pet-input-container">
      <div className="pet-input-header">
        <h2>Pet Astrology Analysis</h2>
        <p>Enter your pet's birth information to generate their personalized astrological profile</p>
      </div>

      <form onSubmit={handleSubmit} className="pet-input-form">
        {/* Pet Basic Information */}
        <div className="form-section">
          <h3>🐾 Pet Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="petName">Pet Name *</label>
              <input
                type="text"
                id="petName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your pet's name"
                className={errors.name ? 'error' : ''}
                disabled={loading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ownerName">Owner Name</label>
              <input
                type="text"
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                placeholder="Your name (optional)"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="species">Species *</label>
              <select
                id="species"
                value={formData.species}
                onChange={(e) => handleInputChange('species', e.target.value)}
                className={errors.species ? 'error' : ''}
                disabled={loading}
              >
                <option value="">Select species</option>
                {speciesOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              {errors.species && <span className="error-message">{errors.species}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="breed">Breed</label>
              <select
                id="breed"
                value={formData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                className={errors.breed ? 'error' : ''}
                disabled={loading || !formData.species}
              >
                <option value="">
                  {formData.species ? 'Select breed' : 'Select species first'}
                </option>
                {formData.species && breedOptions[formData.species]?.map(breed => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
              {errors.breed && <span className="error-message">{errors.breed}</span>}
            </div>
          </div>
        </div>

        {/* Birth Information */}
        <div className="form-section">
          <h3>📅 Birth Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthDate">Birth Date *</label>
              <input
                type="date"
                id="birthDate"
                value={formData.birthDate.toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('birthDate', new Date(e.target.value))}
                className={errors.birthDate ? 'error' : ''}
                disabled={loading}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="birthTime">Birth Time (Approximate)</label>
              <input
                type="time"
                id="birthTime"
                value={formData.birthTime}
                onChange={(e) => handleInputChange('birthTime', e.target.value)}
                disabled={loading}
              />
              <small className="help-text">If exact time is unknown, leave blank or enter approximate time</small>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="form-section">
          <h3>📍 Birth Location</h3>

          <div className="location-input">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude">Latitude *</label>
                <input
                  type="number"
                  id="latitude"
                  value={formData.birthLocation?.latitude || ''}
                  onChange={(e) => handleInputChange('birthLocation', {
                    ...formData.birthLocation,
                    latitude: parseFloat(e.target.value)
                  })}
                  placeholder="28.6139"
                  step="0.0001"
                  min="-90"
                  max="90"
                  className={errors.birthLocation ? 'error' : ''}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">Longitude *</label>
                <input
                  type="number"
                  id="longitude"
                  value={formData.birthLocation?.longitude || ''}
                  onChange={(e) => handleInputChange('birthLocation', {
                    ...formData.birthLocation,
                    longitude: parseFloat(e.target.value)
                  })}
                  placeholder="77.2090"
                  step="0.0001"
                  min="-180"
                  max="180"
                  className={errors.birthLocation ? 'error' : ''}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="location-actions">
              <button
                type="button"
                onClick={getLocationFromCoords}
                className="location-button"
                disabled={loading}
              >
                📍 Use Current Location
              </button>
              <small className="help-text">
                Use your current location or enter the coordinates where your pet was born
              </small>
            </div>

            {errors.birthLocation && <span className="error-message">{errors.birthLocation}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Analyzing...
              </>
            ) : (
              <>
                🔮 Generate Pet Astrology Profile
              </>
            )}
          </button>

          <p className="disclaimer">
            <small>
              * Required fields. The analysis is based on traditional Vedic astrology principles.
              Results are for entertainment and educational purposes.
            </small>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PetAstrologyInput;