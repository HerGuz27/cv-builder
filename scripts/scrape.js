import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const jobSources = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/jobs/search/?keywords=javascript',
    selector: '.base-card',
  },
  {
    name: 'GitHub Jobs',
    url: 'https://github.com/jobs?description=javascript',
    selector: '.Box-row',
  },
];

async function scrapeJobs() {
  const jobs = [];

  for (const source of jobSources) {
    try {
      console.log(`Scraping ${source.name}...`);
      const { data } = await axios.get(source.url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(data);
      const items = $(source.selector);

      items.each((index, element) => {
        const title = $(element).find('.job-title')?.text().trim();
        const company = $(element).find('.company-name')?.text().trim();
        const location = $(element).find('.job-location')?.text().trim();
        const url = $(element).find('a')?.attr('href');

        if (title && company) {
          jobs.push({
            title,
            company,
            location,
            url,
            source: source.name,
            scraped_at: new Date().toISOString(),
          });
        }
      });
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error.message);
    }
  }

  console.log(`Found ${jobs.length} jobs`);
  await saveJobsToDatabase(jobs);
}

async function saveJobsToDatabase(jobs) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('Test mode - jobs not saved to database');
    console.log('Sample jobs:', jobs.slice(0, 3));
    return;
  }

  try {
    const response = await axios.post(
      `${SUPABASE_URL}/rest/v1/jobs`,
      jobs,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
      }
    );
    console.log('Jobs saved successfully');
  } catch (error) {
    console.error('Error saving jobs:', error.message);
  }
}

scrapeJobs();
