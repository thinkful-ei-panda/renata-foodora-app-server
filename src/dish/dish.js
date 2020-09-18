/* eslint-disable eqeqeq */
const restaurantDishService = {
  //THIS SQL DISPLAYS THE DISHES ON THE SCREEN MERGING 3 TABLES: DISH, RESTAURANT AND DISH-HAS-TAG
  showResult(db, tag, priceRange, name) { 
    // PREPARES 'LIKE' PARAMETER
    const likeName = (name === undefined || name === null) ? '%' : '%' + name + '%';
    //PREPARE TAG PARAMETER (SQL DOES NOT LIKE COMPARING EMPTY ARRAY)
    let queryTagFragment = '';
    if (tag !== undefined && tag !== null && tag.length > 0) {
      queryTagFragment = ` having ARRAY[${tag.toString()}]::integer[] <@ ARRAY_REMOVE(ARRAY_AGG(t.id), null)`;
    }

    return (
      db
        .raw(
          'select ' +
            'd.id' +
            ', d.name' +
            ', d.restaurant_id' +
            ', d.price' +
            ', r.name as restaurantname' +
            ', r.phone' +
            ', ARRAY_REMOVE(ARRAY_AGG(t.id), null) as tag_ids' +
            ', ARRAY_REMOVE(ARRAY_AGG(t.tag), null) as tag_names' +
          ' from dish d' +
          ' left join dish_has_tag dht on d.id=dht.dish_id' +
          ' left join tag t on dht.tag_id=t.id' +
          ' left join restaurant r on d.restaurant_id=r.id' +
          ' where d.price >= ?' +
          ' and d.price <= ?' +
          ' and upper(d.name) LIKE upper(\'' + likeName + '\')' +
          ' group by d.id, d.name, r.name, r.phone' +
          queryTagFragment +
          ' order by d.name asc'
          , [priceRange.fromPrice, priceRange.toPrice]
        )
        //.then((dishes) => dishes)
        .then((dishes) => dishes.rows)
    );
  },

  //ADDS A DISH TO DB
  addDish(db, newDish) {
    return db
      .insert({ 
        restaurant_id: newDish.restaurant_id,
        name: newDish.name,
        price: newDish.price
      })
      .into('dish')
      .returning('*')
      .then(([dish]) => dish);
  },

  //ADD TAGS [1-17] TO A SPECIFIC DISH. ADDS AS AN ARRAY 
  addTag(db, dish_id, tag_id){
    const newDishHasTag = {
      dish_id: dish_id,
      tag_id: tag_id
    };

    return db
      .insert(newDishHasTag)
      .into('dish_has_tag')
      .returning('*')
      .then(([tag]) => tag);
  },

  //VALIDATION FOR THE FRONTEND [SEARCH AND ADD DISH] CHOOSE BETWEEN 1-5 TAGS  
  tagValidation(tag){
    if(tag === undefined || tag === null){
      return 'The tag_id field is required.';
    }
    if(tag.length < 1){
      return 'At least one tag needs to be selected.';
    }
    if(tag.length > 5){
      return 'Only up to five tags can be selected.';
    }
    return null;
  },

  //PRICE MAY RANGE 1-100 AND NEEDS TO BE AN INTEGER. 
  priceValidation(price) {
    let parseResult = parseInt(price);
    if (isNaN(parseResult)) {
      return 'Price must be integer.';
    }
    if (parseResult < 1) {
      return 'Price can not be smaller than 1.';
    }
    if (parseResult > 100) {
      return 'Price can not be bigger than 100.';
    }
    return null;
  },

  //GETS THE RESTAURANT INFO + DISHES FROM THAT RESTAURANT
  getById(db, id) {
    return db
      .select(
        'd.id',
        'd.restaurant_id',
        'd.name',
        'd.price',
        'r.name as restaurantname',
        'r.phone'
      )
      .from({ d: 'dish' })
      .leftJoin({ r: 'restaurant' }, 'd.restaurant_id', '=', 'r.id')
      .where('d.id', id);
  },

  //DELETES DISH BY ID
  deleteDish(db, id) {
    return db('dish')
      .where({ id })
      .delete();
  },

  //SQL TO DISPLAY ALL TAGS [SEARCH AND ADD DISH]. READ ONLY.
  getAllTags(db){
    return db
      .select('*')
      .from('tag')
      .orderBy(['tag.tag']);
  },

  //PRICE VALIDATION ON SEARCH SELECTION. CAN BE NULL.
  searchPriceValidation(price){
    let parseResult = parseInt(price);
    if(price == null || price == ''){
      return null;
    }
    if(price > 5 || price < 0){
      return 'Invalid price.';
    }
    if (isNaN(parseResult)) {
      return 'Price must be integer.';
    }
    return null;
  },

  //PRICE RANGES FROM 1-5 = 1-100
  convertPriceToRange(price){
    let fromPrice = 1;
    let toPrice = 100;
    if(price == null){
      // use defaults
    }
    else if (price == 1) {
      toPrice = 10;
    }
    else if (price == 2) {
      fromPrice = 11; 
      toPrice = 40;
    }
    else if (price == 3){
      fromPrice = 41;
      toPrice = 60;
    }
    else if (price == 4){
      fromPrice = 61;
      toPrice = 80;
    }
    else if (price == 5){
      fromPrice = 81;
    } 
    return {
      fromPrice: fromPrice,
      toPrice: toPrice
    };
  },
  
};

module.exports = restaurantDishService;