let currentTripId = null;

async function createTrip(name) {
  const { data, error } = await sb.from('trips').insert({
    name,
    created_by: window.currentUser.id
  }).select().single();

  if (error) { console.error(error); return; }

  await sb.from('trip_members').insert({
    trip_id: data.id,
    user_id: window.currentUser.id,
    role: 'creator'
  });

  currentTripId = data.id;
  window.currentTripId = data.id;
  return data;
}

async function joinTrip(inviteCode) {
  const { data: trip } = await sb.from('trips')
    .select('id')
    .eq('invite_code', inviteCode)
    .single();

  if (!trip) { alert('Invalid invite code'); return; }

  await sb.from('trip_members').upsert({
    trip_id: trip.id,
    user_id: window.currentUser.id,
    role: 'member'
  });

  currentTripId = trip.id;
  window.currentTripId = trip.id;
  return trip;
}

async function saveVote(cityKey, votedYes) {
  await sb.from('destination_votes').upsert({
    trip_id: currentTripId,
    user_id: window.currentUser.id,
    city_key: cityKey,
    voted_yes: votedYes
  });
}

async function saveFilters(filters) {
  await sb.from('trip_filters').upsert({
    trip_id: currentTripId,
    ...filters,
    updated_at: new Date().toISOString()
  });
}

async function saveItinerary(orderedCities) {
  await sb.from('itinerary_order').upsert({
    trip_id: currentTripId,
    ordered_cities: orderedCities,
    confirmed_by: window.currentUser.id,
    confirmed_at: new Date().toISOString()
  });
}

async function subscribeToVotes(onUpdate) {
  return sb.channel('votes:' + currentTripId)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'destination_votes',
      filter: `trip_id=eq.${currentTripId}`
    }, onUpdate)
    .subscribe();
}