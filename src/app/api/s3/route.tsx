import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  },
});

const yogaPoseMap: { [key: string]: string } = {
  "balasana": 'balasana.jpg',
  "catcow": 'catcow.jpg',
  "boatpose": 'boatpose.jpg',
  "bridgepose": 'bridgepose.jpg',
  "catpose": 'catpose.jpg',
  "catcowpose": 'catpose.jpg',
  "cat-cowpose": 'catpose.jpg',
  "chairpose": 'chairpose.jpg',
  "childspose": 'childpose.jpg',
  "cobrapose": 'cobrapose.jpg',
  "bhujangasanacobrapose": 'cobrapose.jpg',
  "corpsepose": 'corpsepose.jpg',
  "savasanacorpsepose": 'corpsepose.jpg',
  "cowfacepose": 'cowfacepose.jpg',
  "cranepose": 'cranepose.jpg',
  "dancepose": 'dancepose.jpg',
  "dolphinpose": 'dolphinpose.jpg',
  "downwardfacingdog": 'downwardfacingdog.jpg',
  "eaglepose3": 'eaglepose3.jpg',
  "easypose": 'easypose.jpg',
  "fireflypose": 'fireflypose.jpg',
  "firelogpose": 'firelogpose.jpg',
  "happybabypose": 'happybabypose.jpg',
  "headstandpose": 'headstandpose.jpg',
  "mountainpose": 'mountainpose.jpg',
  "plankpose": 'plankpose.jpg',
  "thunderboltpose": 'thunderboltpose.jpg',
  "treepose": 'treepose.jpg',
  "trianglepose": 'trianglepose.jpg',
  "upwardfacingdog": 'upwardfacingdog.jpg',
  "upwardsalute": 'upwardsalute.jpg',
  "warrionone": 'warrionone.jpg',
  "warrioriipose": 'warrioriipose.jpg',

};

async function getPoseImageUrl(poseName: string) {

  const imageFile = yogaPoseMap[poseName.toLowerCase()];
  if (!imageFile) {
    return null;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'yoga-images',
      Key: imageFile,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    // console.log(url)
    return url;
  } catch (error) {
    console.error(`Error fetching image for pose ${poseName}:`, error);
    return null;
  }
}
function normalizePoseName(poseName: string): string {
  return poseName
    .toLowerCase()                    // Convert to lowercase
    .replace(/[\s-]+/g, '')           // Remove spaces and hyphens
    .replace(/[^a-z0-9]/g, '');       // Remove all non-alphanumeric characters
}
export async function POST(request: Request) {
  try {
    const body = await request.json();  // Parse the JSON body
    const poseNames: string[] = body.poseNames;

    // console.log(poseNames)
    if (!poseNames || poseNames.length === 0) {
      return NextResponse.json({ message: 'Pose names are required' }, { status: 400 });
    }

    const normalizedPoseNames = poseNames.map(normalizePoseName);

    // Map the normalized pose names to their respective image URLs
    const imageUrls = await Promise.all(normalizedPoseNames.map(poseName => getPoseImageUrl(poseName)));

    return NextResponse.json({ imageUrls }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Error processing request', error: (error as Error).message }, { status: 500 });
  }
}

