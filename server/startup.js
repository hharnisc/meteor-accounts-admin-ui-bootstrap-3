Meteor.startup(function() {
	// console.log('accounts-admin startup');
	// create an admin role if it doesn't exist
	if (Meteor.roles.find({name: 'admin'}).count() < 1 ) {
		Roles.createRole('admin');
	}
	if(process.env.NODE_ENV == 'development' && process.env.METEOR_RANDOM_USERS)
	{
		var randomNames = [
			'Nadine Maldonado',
			'Sheri Pope',
			'Bobbie Sherman',
			'Ethel Palmer',
			'Bessie Romero',
			'Gabriel Fletcher',
			'Mattie Johnson',
			'Crystal Ray',
			'Latoya James',
			'Rose Jennings',
			'Anthony Newman',
			'Lucas Welch',
			'Greg Perkins',
			'Neil Moran',
			'Joann Rodriquez',
			'Reginald Mason',
			'Vera Perry',
			'Scott Curry',
			'Angelica Quinn',
			'Cesar Morales',
			'Angel Steele',
			'Lucille Meyer',
			'Gary Massey',
			'Gerardo Ortiz',
			'Sophie Burns',
			'Woodrow Park',
			'Hazel Russell',
			'Earl Powell',
			'Elbert Gonzales',
			'Ryan Powers',
			'Blake Nichols',
			'Melba Swanson',
			'Manuel Scott',
			'Natasha Jackson',
			'Shawna Fields',
			'Katie Lyons',
			'Pablo Abbott',
			'Christopher Moss',
			'Lisa Morris',
			'Toni Cobb',
			'Clifton Howard',
			'Tina Watson',
			'Stanley Castro',
			'Kathleen Delgado',
			'Javier Mccarthy',
			'Ora Kennedy',
			'Darren Diaz',
			'Kelvin Floyd',
			'Daryl Townsend',
			'Jamie Copeland',
			'Lynn Blair',
			'Tim Payne',
			'Elsa Carpenter',
			'Roy Hawkins',
			'Delbert Nguyen',
			'Inez Harrington',
			'Mike Paul',
			'Gretchen Hunter',
			'Leonard Harrison',
			'Wanda Young',
			'Sheldon Henderson',
			'Jean Mckenzie',
			'George Crawford',
			'Kay Larson',
			'Cecelia Montgomery',
			'Roderick Barnett',
			'Terrell Cohen',
			'Miriam Phelps',
			'Charlene Elliott',
			'Carla Singleton',
			'Marjorie Allison',
			'Lori French',
			'Lynette Lloyd',
			'Ernest Guerrero',
			'Jody Goodman',
			'Ramiro Vega',
			'Chelsea Rivera',
			'May Rodriguez',
			'Robin Ball',
			'Frederick Mack',
			'Lucia Burgess',
			'Harriet Bridges',
			'Freddie Riley',
			'Pearl Butler',
			'Julia Silva',
			'Malcolm Gibbs',
			'Lindsay Pierce',
			'Karl Gregory',
			'Evan Matthews',
			'Patsy Long',
			'Myra Ingram',
			'Jeremiah Collins',
			'Clay Harvey',
			'Shari Thomas',
			'Jackie Rowe',
			'Lindsey Freeman',
			'Norman Wright',
			'Veronica Carroll',
			'Violet Valdez',
			'Rosa Malone'
		];
		var c = Meteor.users.find().count();
		if( c!=5 && c < 100)
		{
			console.log('create users', c);
			for(var i=c;i<=100;i++)
			{
				var random = randomNames.pop();
				var email = random.replace(/ /g,'_');
				Accounts.createUser({
					username: random,
					password: 'password',
					email: email+'@random-name-generator.info',
					profile: {
						name: random,
						random: true
					}
				});
			}
		}
	}
});