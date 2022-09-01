mod lib;

fn main() {
    println!("Hello, world!");

    lib::eat_at_restaurant();

    lib::test_hash_map();

    // lib::test_handle_error();

    lib::test_create_file();

    lib::test_write_to_string().unwrap();
}
