import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HotelForm, { validate } from './components/HotelForm';

beforeAll(() => {
  if (!globalThis.URL.createObjectURL) {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:test-preview');
  }
  if (!globalThis.URL.revokeObjectURL) {
    globalThis.URL.revokeObjectURL = vi.fn();
  }
});

describe('HotelForm validate function', () => {
  it('returns errors when fields are empty', () => {
    const emptyValues = {
      title: '',
      description: '',
      price: '',
      latitude: '',
      longitude: '',
      area: '',
      rooms_available: '',
      imageFile: null,
    };
    const errors = validate(emptyValues);

    expect(errors.title).toBeDefined();
    expect(errors.description).toBeDefined();
    expect(errors.price).toBeDefined();
    expect(errors.latitude).toBeDefined();
    expect(errors.longitude).toBeDefined();
    expect(errors.area).toBeDefined();
    expect(errors.rooms_available).toBeDefined();
    expect(errors.image).toBeDefined();
  });

  it('returns no errors when values are valid', () => {
    const validValues = {
      title: 'Grand Palace Hotel',
      description: 'A wonderful luxury hotel with scenic views and pools.',
      price: '150.00',
      latitude: '12.971598',
      longitude: '77.594562',
      area: 'RS Puram',
      rooms_available: '5',
      imageFile: new File(['dummy'], 'hotel.png', { type: 'image/png' }),
    };
    const errors = validate(validValues);

    expect(Object.keys(errors).length).toBe(0);
  });

  it('rejects latitude 91 and longitude -181', () => {
    const invalidCoords = {
      title: 'Test Hotel',
      description: 'Valid hotel description for testing coords.',
      price: '100',
      latitude: '91',
      longitude: '-181',
      area: 'RS Puram',
      rooms_available: '5',
      imageFile: new File(['dummy'], 'hotel.png', { type: 'image/png' }),
    };
    const errors = validate(invalidCoords);

    expect(errors.latitude).toBe('Latitude is required (between -90 and 90)');
    expect(errors.longitude).toBe('Longitude is required (between -180 and 180)');
  });

  it('rejects price 0', () => {
    const zeroPrice = {
      title: 'Free Hotel',
      description: 'Valid description for testing price constraint.',
      price: '0',
      latitude: '10',
      longitude: '20',
      area: 'RS Puram',
      rooms_available: '5',
      imageFile: new File(['dummy'], 'hotel.png', { type: 'image/png' }),
    };
    const errors = validate(zeroPrice);

    expect(errors.price).toBe('Price is required and must be greater than 0');
  });

  it('rejects negative or invalid rooms_available', () => {
    const badRooms = {
      title: 'Valid Hotel',
      description: 'Valid description for testing rooms.',
      price: '2000',
      latitude: '11',
      longitude: '77',
      area: 'RS Puram',
      rooms_available: '-2',
      imageFile: new File(['dummy'], 'hotel.png', { type: 'image/png' }),
    };
    const errors = validate(badRooms);

    expect(errors.rooms_available).toBe('Rooms available must be a whole number 0 or greater');
  });
});

describe('HotelForm Component rendering and submission', () => {
  it('submitting empty shows error messages and does not call onSubmit', () => {
    const handleSubmit = vi.fn();
    render(<HotelForm onSubmit={handleSubmit} submitting={false} />);

    const submitBtn = screen.getByRole('button', { name: /create hotel/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('filling valid values calls onSubmit once', () => {
    const handleSubmit = vi.fn();
    render(<HotelForm onSubmit={handleSubmit} submitting={false} />);

    fireEvent.change(screen.getByLabelText(/Hotel Title/i), {
      target: { value: 'Valid Hotel Title' },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'This is a valid long description for testing.' },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: '180.50' },
    });
    fireEvent.change(screen.getByLabelText(/Latitude/i), {
      target: { value: '15.5' },
    });
    fireEvent.change(screen.getByLabelText(/Longitude/i), {
      target: { value: '75.2' },
    });
    fireEvent.change(screen.getByLabelText(/Area \/ Locality/i), {
      target: { value: 'RS Puram' },
    });
    fireEvent.change(screen.getByLabelText(/Rooms Available/i), {
      target: { value: '5' },
    });

    const file = new File(['content'], 'hotel.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Hotel Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitBtn = screen.getByRole('button', { name: /create hotel/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});

