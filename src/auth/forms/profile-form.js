const vehicleOptions = [
  { value: 'Пішки', label: 'Пішки' },
  { value: 'Велосипед', label: 'Велосипед' },
  { value: 'Скутер', label: 'Скутер' },
  { value: 'Автомобіль', label: 'Автомобіль' }
];

export function buildProfileFields(user, values = {}) {
  const fields = [
    {
      name: 'phone',
      label: 'Телефон',
      type: 'tel',
      required: true,
      value: values.phone ?? user.phone ?? ''
    }
  ];

  if (user.freelancer) {
    fields.push(
      {
        name: 'city',
        label: 'Місто',
        type: 'text',
        required: true,
        value: values.city ?? user.freelancer.city
      },
      {
        name: 'specialty',
        label: 'Спеціальність',
        type: 'text',
        required: true,
        value: values.specialty ?? user.freelancer.specialty
      },
      {
        name: 'hourlyRate',
        label: 'Ставка, $ за годину',
        type: 'number',
        min: 0,
        step: '0.5',
        required: true,
        value: values.hourlyRate ?? user.freelancer.hourlyRate
      },
      {
        name: 'bio',
        label: 'Про фахівця',
        type: 'textarea',
        wide: true,
        rows: 4,
        value: values.bio ?? user.freelancer.bio ?? ''
      }
    );
  }

  if (user.customer) {
    fields.push(
      {
        name: 'companyName',
        label: 'Компанія',
        type: 'text',
        required: true,
        value: values.companyName ?? user.customer.companyName
      },
      {
        name: 'city',
        label: 'Місто',
        type: 'text',
        required: true,
        value: values.city ?? user.customer.city
      }
    );
  }

  if (user.courier) {
    fields.push(
      {
        name: 'vehicle',
        label: 'Транспорт',
        type: 'select',
        required: true,
        options: vehicleOptions,
        value: values.vehicle ?? user.courier.vehicle
      },
      {
        name: 'zone',
        label: 'Зона доставки',
        type: 'text',
        required: true,
        value: values.zone ?? user.courier.zone
      }
    );
  }

  return fields;
}
