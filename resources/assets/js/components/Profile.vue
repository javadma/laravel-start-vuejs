<style>
    .widget-user-header {
        background-position: center center;
        height: 250px !important;
        /*-webkit-background-size: conver;*/
        /*background-size: conver;*/

    }
</style>
<template>
    <div class="container">
        <div class="box box-widget widget-user mt-3">
            <!-- Add the bg color to the header using any of the bg-* classes -->
            <div class="widget-user-header bg-black" style="background: url('/img/user-cover.jpg') center center;">
                <h3 class="widget-user-username">{{form.name}}</h3>
                <h5 class="widget-user-desc">{{this.form.type}}</h5>
            </div>
            <div class="widget-user-image justify-content-around">
                <img class="img-circle" :src="getProfilePhoto()" alt="User Avatar">
            </div>

        </div>
        <!-- tab -->

        <div class="row">
            <div class="col-md-12 mt-3">
                <div class="card">
                    <div class="card-header p-2">
                        <ul class="nav nav-pills">
                            <li class="nav-item"><a class="nav-link" href="#activity" data-toggle="tab">Activity</a>
                            </li>
                            <li class="nav-item"><a class="nav-link active show" href="#settings" data-toggle="tab">Settings</a>
                            </li>
                        </ul>
                    </div><!-- /.card-header -->
                    <div class="card-body">
                        <div class="tab-content">
                            <!-- Activity Tab -->
                            <div class="tab-pane" id="activity">
                                <h3 class="text-center">{{form.bio}}</h3>
                            </div>
                            <!-- Setting Tab -->
                            <div class="tab-pane active show" id="settings">
                                <form class="form-horizontal">
                                    <div class="form-group">
                                        <label for="inputName" class="col-sm-2 control-label">Name</label>

                                        <div class="col-sm-12">
                                            <input type="text" v-model="form.name" class="form-control" id="inputName"
                                                   placeholder="Name"
                                                   :class="{ 'is-invalid': form.errors.has('name') }">
                                            <has-error :form="form" field="name"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="inputEmail" class="col-sm-2 control-label">Email</label>

                                        <div class="col-sm-12">
                                            <input v-model="form.email" type="email" class="form-control"
                                                   id="inputEmail"
                                                   placeholder="Email"
                                                   :class="{ 'is-invalid': form.errors.has('email') }">
                                            <has-error :form="form" field="email"></has-error>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="inputExperience" class="col-sm-2 control-label">Experience</label>

                                        <div class="col-sm-12">
                                            <textarea v-model="form.bio" class="form-control" id="inputExperience"
                                                      placeholder="Experience"></textarea>
                                            <has-error :form="form" field="bio"></has-error>
                                        </div>
                                    </div>
                                    <div class="col-sm-12">
                                        <div class="custom-file">
                                            <input @change="updateProfile" type="file" class="custom-file-input"
                                                   name="photo" id="customFile">
                                            <label class="custom-file-label" for="customFile">Choose Your Profile
                                                Picture</label>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="password" class="col-sm-12 control-label">Password (leave empty if
                                            not changing)</label>

                                        <div class="col-sm-12">
                                            <input type="password" v-model="form.password"
                                                   name="password"
                                                   class="form-control"
                                                   id="password"
                                                   placeholder="password"
                                                   :class="{ 'is-invalid': form.errors.has('password') }"
                                            >
                                            <has-error :form="form" field="password"></has-error>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="col-sm-offset-2 col-sm-12">
                                            <button @click.prevent="updateInfo" type="submit" class="btn btn-success">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <!-- /.tab-pane -->
                        </div>
                        <!-- /.tab-content -->
                    </div><!-- /.card-body -->
                </div>
                <!-- /.nav-tabs-custom -->
            </div>
        </div>
        <!-- end tabs -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    bio: '',
                    photo: '',
                    password: ''
                })
            }
        },
        methods: {
            getProfilePhoto() {
                let photo = (this.form.photo.length > 200) ? this.form.photo : "img/profile/" + this.form.photo;
                return photo;
            },
            updateInfo() {
                this.$Progress.start();
                this.form.put('/api/profile')
                    .then(() => {
                        Fire.$emit('updateTable');
                        this.$Progress.finish();
                        swal.fire({
                            type: 'success',
                            title: 'Successfully',
                            text: 'The Profile  Updated Successfully',
                        });
                    })
                    .catch(() => {
                        this.$Progress.fail();
                    })
            },
            updateProfile(e) {
                let file = e.target.files[0];
                let reader = new FileReader();
                let vm = this;
                if (file['size'] < 2111775) {
                    reader.onloadend = function (file) {
                        vm.form.photo = reader.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'You are uploading a large file',
                    });
                }
            },
            loadProfile() {
                axios.get('/api/profile').then(({data}) => this.form.fill(data));
            },
        },
        mounted() {
            console.log('Profile Component mounted.')
        },
        created() {
            this.loadProfile();
            Fire.$on('updateTable', () => {
                this.loadProfile();
            });
        }
    }
</script>
