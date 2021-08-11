module.exports = {
  SENDER_EMAIL: 'BookMyPG<bookmypg.n5lambda@gmail.com>',
  RENT_FILTER_CONVENTIONS: [
    {
      greater_than: 0,
      less_than: 10000,
    },
    {
      greater_than: 10000,
      less_than: 15000,
    },
    {
      greater_than: 15000,
    },
  ],
  POPULATE_USER_FIELDS: ['firstName', 'lastName'],
  POPULATE_AMENITY_FIELDS: ['name', 'logo'],
  POPULATE_LOCATION_FIELDS: ['name'],
  POPULATE_PROPERTY_FIELDS: ['name'],
  EMAIL_TEMPLATE_TEXT: {
    Visit: 'visitTemplate',
    Userrating: 'userratingTemplate',
    Propertyrating: 'propertyratingTemplate',
    Query: 'queryTemplate',
  },
};
