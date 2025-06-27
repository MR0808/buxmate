'use server';

import { prisma } from '@/lib/prisma';
// import { placeFormSchema, type PlaceFormValues } from '@/schemas/event';
// import { revalidatePath } from 'next/cache';

// export async function createPlace(data: PlaceFormValues) {
//     try {
//         // Validate the data
//         const validatedData = placeFormSchema.parse(data);

//         // Check if place already exists
//         const existingPlace = await prisma.place.findUnique({
//             where: { placeId: validatedData.placeId }
//         });

//         if (existingPlace) {
//             return {
//                 success: false,
//                 error: 'This place has already been added to the database'
//             };
//         }

//         // Create the place
//         const place = await prisma.place.create({
//             data: {
//                 placeId: validatedData.placeId,
//                 name: validatedData.name,
//                 formattedAddress: validatedData.formattedAddress,
//                 latitude: validatedData.latitude,
//                 longitude: validatedData.longitude,
//                 streetNumber: validatedData.streetNumber,
//                 route: validatedData.route,
//                 locality: validatedData.locality,
//                 administrativeArea1: validatedData.administrativeArea1,
//                 administrativeArea2: validatedData.administrativeArea2,
//                 country: validatedData.country,
//                 postalCode: validatedData.postalCode,
//                 types: validatedData.types || [],
//                 businessStatus: validatedData.businessStatus,
//                 rating: validatedData.rating,
//                 userRatingsTotal: validatedData.userRatingsTotal,
//                 priceLevel: validatedData.priceLevel,
//                 website: validatedData.website,
//                 phoneNumber: validatedData.phoneNumber,
//                 openingHours: validatedData.openingHours,
//                 photos: validatedData.photos,
//                 reviews: validatedData.reviews,
//                 plusCode: validatedData.plusCode,
//                 utcOffset: validatedData.utcOffset,
//                 viewportNortheastLat: validatedData.viewportNortheastLat,
//                 viewportNortheastLng: validatedData.viewportNortheastLng,
//                 viewportSouthwestLat: validatedData.viewportSouthwestLat,
//                 viewportSouthwestLng: validatedData.viewportSouthwestLng
//             }
//         });

//         revalidatePath('/');

//         return {
//             success: true,
//             data: place
//         };
//     } catch (error) {
//         console.error('Error creating place:', error);
//         return {
//             success: false,
//             error: 'Failed to save place to database'
//         };
//     }
// }

export async function getPlaces() {
    try {
        const places = await prisma.place.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return {
            success: true,
            data: places
        };
    } catch (error) {
        console.error('Error fetching places:', error);
        return {
            success: false,
            error: 'Failed to fetch places'
        };
    }
}
