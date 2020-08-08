const restaurantDishService = {
  showResult(db, id) {
    return (
      db
        .select(
          "d.id",
          "d.restaurant_id",
          "d.name",
          "d.price",
          "r.name as restaurantname",
          "r.phone",
          "t.tag"
        )
        .from({ d: "dish" })
        .leftJoin({ r: "restaurant" }, "d.restaurant_id", "=", "r.id")
        .leftJoin({ dht: "dish_has_tag" }, "d.id", "=", "dht.dish_id")
        .leftJoin({ t: "tag" }, "dht.tag_id", "=", "t.id")
        //TODO DO NOT UNCOMMENT WHERE
        //.where('d.restaurant_id', id)
        .then((results) => {
          return results.reduce((result, unflatDish) => {
            result[unflatDish.id] = result[unflatDish.id] || {
              ...unflatDish,
              tags: [],
            };

            result[unflatDish.id].tags.push(unflatDish.tag);
            return result;
          }, {});
        })
    );
    //.orderBy(['dish.name', 'restaurant.name', 'tag.tag']);
  },

  addDish(db, newDish) {
    return db
      .insert(newDish)
      .into("dish")
      .returning("*")
      .then(([dish]) => dish);
  },

  addTag(db, dish_id, tag_id){
    const newDishHasTag = {
      dish_id: dish_id,
      tag_id: tag_id
    };
    console.log("addTag -> newDishHasTag", JSON.stringify(newDishHasTag));
    return db
    .insert(newDishHasTag)
    .into("dish_has_tag")
    .returning('*')
    .then(([tag]) => tag);
  },

  tagValidation(tag){
    if(tag.length < 1){
      return 'At least one tag needs to be selected.';
    }
    if(tag.length > 5){
      return 'Only five tags can be selected.';
    }
    return null;
  },

  getAllDishes(db) {
    return db
    .select("*")
    .from("dish");
  },

  priceValidation(price) {
    let parseResult = parseInt(price);
    if (isNaN(parseResult)) {
      return "Price must be integer.";
    }
    if (parseResult < 1) {
      return "Price can not be smaller than 1.";
    }
    if (parseResult > 100) {
      return "Price can not be bigger than 100.";
    }
    return null;
  },

  getById(db, id) {
    return db
      .select(
        "d.id",
        "d.restaurant_id",
        "d.name",
        "d.price",
        "r.name as restaurantname",
        "r.phone"
      )
      .from({ d: "dish" })
      .leftJoin({ r: "restaurant" }, "d.restaurant_id", "=", "r.id")
      .where("d.id", id);
  },

  deleteDish(db, id) {
    return db("dish").where({ id }).delete();
  },

  updateDish(db, id, price) {
    return db("dish").where("id", "=", id).update({ price: price });
  },

  getAllTags(db){
    return db
    .select('*')
    .from('tag')
    .orderBy(['tag.tag']);
  },
  
};

module.exports = restaurantDishService;
