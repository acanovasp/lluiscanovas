import {defineField, defineType} from 'sanity'

export const portfolioType = defineType({
  name: 'portfolio',
  title: 'Portfolio Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A short title for this image (used for accessibility)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Upload your photography or graphic design work',
      options: {
        hotspot: true, // Enables image cropping
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'What type of work is this?',
      options: {
        list: [
          {title: 'Photography', value: 'photography'},
          {title: 'Graphic Design', value: 'graphic-design'},
        ],
        layout: 'radio', // Shows as radio buttons instead of dropdown
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Position in Slider',
      type: 'number',
      description: 'Order in the slider (1 = first, 2 = second, etc.)',
      validation: (Rule) => Rule.required().min(1).integer(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      position: 'position',
      media: 'image',
    },
    prepare(selection) {
      const {title, category, position, media} = selection
      const categoryLabel = category === 'photography' ? '📸' : '🎨'
      return {
        title: `${position}. ${title}`,
        subtitle: `${categoryLabel} ${category === 'photography' ? 'Photography' : 'Graphic Design'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Position',
      name: 'positionAsc',
      by: [
        {field: 'position', direction: 'asc'}
      ]
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'position', direction: 'asc'}
      ]
    },
  ]
})
